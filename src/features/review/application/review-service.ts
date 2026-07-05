import type { PrismaClient } from "@/generated/prisma/client";

import { applyGamification } from "@/features/progress/application/gamification-service";
import { applyReview } from "../domain/review-policy";
import type {
  ReviewAttemptDto,
  ReviewSessionDto,
  VocabularyCardDto,
  VocabularyPageDto,
} from "./contracts";
import { ReviewApplicationError } from "./errors";
import {
  completeReviewSessionSchema,
  createReviewSessionSchema,
  setVocabularySavedSchema,
  submitReviewSchema,
  vocabularyFiltersSchema,
  type CompleteReviewSessionInput,
  type CreateReviewSessionInput,
  type SetVocabularySavedInput,
  type SubmitReviewInput,
  type VocabularyFiltersInput,
} from "./schemas";

type Clock = () => Date;

function toSessionDto(session: {
  id: string;
  source: "FEED" | "REVIEW";
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  totalCards: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned: number;
  completedAt: Date | null;
}): ReviewSessionDto {
  return {
    ...session,
    completedAt: session.completedAt?.toISOString() ?? null,
  };
}

export class ReviewService {
  constructor(
    private readonly db: PrismaClient,
    private readonly clock: Clock = () => new Date(),
  ) {}

  async listVocabulary(
    input: VocabularyFiltersInput,
  ): Promise<VocabularyPageDto> {
    const filters = vocabularyFiltersSchema.parse(input);
    const where = {
      category: filters.category,
      level: filters.level,
      users:
        filters.savedOnly || filters.status
          ? {
              some: {
                userId: filters.userId,
                isSaved: filters.savedOnly ? true : undefined,
                status: filters.status,
              },
            }
          : undefined,
    };
    const records = await this.db.vocabulary.findMany({
      where,
      include: {
        users: { where: { userId: filters.userId }, take: 1 },
      },
      orderBy: { id: "asc" },
      cursor: filters.cursor ? { id: filters.cursor } : undefined,
      skip: filters.cursor ? 1 : 0,
      take: filters.limit + 1,
    });
    const hasMore = records.length > filters.limit;
    const page = records.slice(0, filters.limit);
    const totalCount = await this.db.vocabulary.count({ where });

    return {
      items: page.map(({ users, ...vocabulary }): VocabularyCardDto => {
        const progress = users[0];
        return {
          id: vocabulary.id,
          word: vocabulary.word,
          pronunciation: vocabulary.pronunciation,
          translation: vocabulary.translation,
          example: vocabulary.example,
          exampleTranslation: vocabulary.exampleTranslation,
          category: vocabulary.category,
          level: vocabulary.level,
          progress: progress
            ? {
                mastery: progress.mastery,
                correctCount: progress.correctCount,
                wrongCount: progress.wrongCount,
                isSaved: progress.isSaved,
                status: progress.status,
                nextReviewAt: progress.nextReviewAt?.toISOString() ?? null,
              }
            : null,
        };
      }),
      nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null,
      totalCount,
    };
  }

  async listDueVocabulary(
    userId: string,
    limit = 20,
  ): Promise<VocabularyCardDto[]> {
    const parsed = vocabularyFiltersSchema
      .pick({ userId: true, limit: true })
      .parse({
        userId,
        limit,
      });
    const records = await this.db.userVocabulary.findMany({
      where: {
        userId: parsed.userId,
        nextReviewAt: { lte: this.clock() },
      },
      include: { vocabulary: true },
      orderBy: [{ nextReviewAt: "asc" }, { id: "asc" }],
      take: parsed.limit,
    });

    return records.map(({ vocabulary, ...progress }) => ({
      id: vocabulary.id,
      word: vocabulary.word,
      pronunciation: vocabulary.pronunciation,
      translation: vocabulary.translation,
      example: vocabulary.example,
      exampleTranslation: vocabulary.exampleTranslation,
      category: vocabulary.category,
      level: vocabulary.level,
      progress: {
        mastery: progress.mastery,
        correctCount: progress.correctCount,
        wrongCount: progress.wrongCount,
        isSaved: progress.isSaved,
        status: progress.status,
        nextReviewAt: progress.nextReviewAt?.toISOString() ?? null,
      },
    }));
  }

  async setSaved(
    input: SetVocabularySavedInput,
  ): Promise<{ isSaved: boolean }> {
    const data = setVocabularySavedSchema.parse(input);
    const vocabulary = await this.db.vocabulary.findUnique({
      where: { id: data.vocabularyId },
      select: { id: true },
    });
    if (!vocabulary) {
      throw new ReviewApplicationError("NOT_FOUND", "Vocabulary not found");
    }

    const record = await this.db.userVocabulary.upsert({
      where: {
        userId_vocabularyId: {
          userId: data.userId,
          vocabularyId: data.vocabularyId,
        },
      },
      create: data,
      update: { isSaved: data.isSaved },
      select: { isSaved: true },
    });
    return record;
  }

  async createSession(
    input: CreateReviewSessionInput,
  ): Promise<ReviewSessionDto> {
    const data = createReviewSessionSchema.parse(input);
    const vocabularyIds = [...new Set(data.vocabularyIds)];

    return this.db.$transaction(
      async (tx) => {
        const count = await tx.vocabulary.count({
          where: { id: { in: vocabularyIds } },
        });
        if (count !== vocabularyIds.length) {
          throw new ReviewApplicationError("NOT_FOUND", "Vocabulary not found");
        }

        if (data.source === "FEED") {
          await tx.userVocabulary.createMany({
            data: vocabularyIds.map((vocabularyId) => ({
              userId: data.userId,
              vocabularyId,
            })),
            skipDuplicates: true,
          });
        }

        const now = this.clock();
        const progress = await tx.userVocabulary.findMany({
          where: { userId: data.userId, vocabularyId: { in: vocabularyIds } },
          select: {
            id: true,
            vocabularyId: true,
            status: true,
            lastReviewedAt: true,
            nextReviewAt: true,
            _count: { select: { attempts: true } },
          },
        });
        if (progress.length !== vocabularyIds.length) {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            "Review sessions require previously learned vocabulary",
          );
        }

        const byVocabularyId = new Map(
          progress.map((record) => [record.vocabularyId, record]),
        );
        const eligible = vocabularyIds.every((vocabularyId) => {
          const record = byVocabularyId.get(vocabularyId)!;
          return data.source === "FEED"
            ? record.status === "NEW" &&
                record.lastReviewedAt === null &&
                record._count.attempts === 0
            : record.nextReviewAt !== null && record.nextReviewAt <= now;
        });
        if (!eligible) {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            data.source === "FEED"
              ? "Feed sessions only accept vocabulary never reviewed before"
              : "Review sessions only accept vocabulary that is due",
          );
        }

        const session = await tx.reviewSession.create({
          data: {
            userId: data.userId,
            source: data.source,
            totalCards: vocabularyIds.length,
          },
        });
        await tx.reviewSessionItem.createMany({
          data: vocabularyIds.map((vocabularyId, position) => ({
            sessionId: session.id,
            userId: data.userId,
            userVocabularyId: byVocabularyId.get(vocabularyId)!.id,
            position,
          })),
        });
        return toSessionDto(session);
      },
      { isolationLevel: "Serializable" },
    );
  }

  async submitReview(input: SubmitReviewInput): Promise<ReviewAttemptDto> {
    const data = submitReviewSchema.parse(input);
    const existing = await this.db.reviewAttempt.findUnique({
      where: { clientRequestId: data.clientRequestId },
      include: { userVocabulary: true, user: true },
    });
    if (existing) {
      return this.restoreAttempt(data, existing);
    }

    for (
      let transactionAttempt = 0;
      transactionAttempt < 3;
      transactionAttempt++
    ) {
      try {
        return await this.persistReview(data);
      } catch (error) {
        if (!this.isRetryableTransactionError(error)) {
          throw error;
        }

        const replay = await this.db.reviewAttempt.findUnique({
          where: { clientRequestId: data.clientRequestId },
          include: { userVocabulary: true, user: true },
        });
        if (replay) {
          return this.restoreAttempt(data, replay);
        }
        if (transactionAttempt === 2 || this.errorCode(error) !== "P2034") {
          throw error;
        }
      }
    }

    throw new ReviewApplicationError("CONFLICT", "Could not persist review");
  }

  async completeSession(
    input: CompleteReviewSessionInput,
  ): Promise<ReviewSessionDto> {
    const data = completeReviewSessionSchema.parse(input);
    return this.db.$transaction(
      async (tx) => {
        const session = await tx.reviewSession.findUnique({
          where: { id_userId: { id: data.sessionId, userId: data.userId } },
        });
        if (!session) {
          throw new ReviewApplicationError(
            "NOT_FOUND",
            "Review session not found",
          );
        }
        if (session.status === "ABANDONED") {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            "Session was abandoned",
          );
        }
        if (session.status === "COMPLETED") return toSessionDto(session);

        const [totalItems, remaining] = await Promise.all([
          tx.reviewSessionItem.count({
            where: { sessionId: data.sessionId, userId: data.userId },
          }),
          tx.reviewSessionItem.count({
            where: {
              sessionId: data.sessionId,
              userId: data.userId,
              consumedAt: null,
            },
          }),
        ]);
        if (totalItems !== session.totalCards || remaining > 0) {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            "All session items must be reviewed before completion",
          );
        }

        const updated = await tx.reviewSession.update({
          where: { id_userId: { id: data.sessionId, userId: data.userId } },
          data: { status: "COMPLETED", completedAt: this.clock() },
        });
        return toSessionDto(updated);
      },
      { isolationLevel: "Serializable" },
    );
  }

  private async persistReview(
    data: ReturnType<typeof submitReviewSchema.parse>,
  ): Promise<ReviewAttemptDto> {
    const now = this.clock();
    return this.db.$transaction(
      async (tx) => {
        const session = await tx.reviewSession.findUnique({
          where: { id_userId: { id: data.sessionId, userId: data.userId } },
        });
        if (!session) {
          throw new ReviewApplicationError(
            "NOT_FOUND",
            "Review session not found",
          );
        }
        if (session.status !== "IN_PROGRESS") {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            "Session is not active",
          );
        }

        const item = await tx.reviewSessionItem.findFirst({
          where: {
            sessionId: data.sessionId,
            userId: data.userId,
            userVocabulary: { vocabularyId: data.vocabularyId },
          },
          include: {
            userVocabulary: {
              include: { _count: { select: { attempts: true } } },
            },
          },
        });
        if (!item || item.userId !== data.userId) {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            "Vocabulary does not belong to this session",
          );
        }
        if (item.consumedAt) {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            "Session item was already reviewed",
          );
        }

        const progress = item.userVocabulary;
        const eligible =
          session.source === "FEED"
            ? progress.status === "NEW" &&
              progress.lastReviewedAt === null &&
              progress._count.attempts === 0
            : progress.nextReviewAt !== null && progress.nextReviewAt <= now;
        if (!eligible) {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            session.source === "FEED"
              ? "Vocabulary was already reviewed"
              : "Vocabulary is not due for review",
          );
        }

        const user = await tx.user.findUnique({ where: { id: data.userId } });
        if (!user) {
          throw new ReviewApplicationError("NOT_FOUND", "User not found");
        }
        const outcome = applyReview(
          {
            mastery: progress.mastery,
            correctCount: progress.correctCount,
            wrongCount: progress.wrongCount,
            totalXp: user.xp,
          },
          data.rating,
          now,
        );
        const updatedProgress = await tx.userVocabulary.update({
          where: { id_userId: { id: progress.id, userId: data.userId } },
          data: {
            mastery: outcome.masteryAfter,
            correctCount: outcome.correctCount,
            wrongCount: outcome.wrongCount,
            status: outcome.status,
            lastReviewedAt: now,
            nextReviewAt: outcome.nextReviewAt,
          },
        });
        const attempt = await tx.reviewAttempt.create({
          data: {
            clientRequestId: data.clientRequestId,
            sessionId: data.sessionId,
            userId: data.userId,
            userVocabularyId: progress.id,
            rating: data.rating,
            isCorrect: outcome.isCorrect,
            masteryBefore: outcome.masteryBefore,
            masteryAfter: outcome.masteryAfter,
            xpEarned: outcome.xpEarned,
            nextReviewAt: outcome.nextReviewAt,
          },
        });
        const consumed = await tx.reviewSessionItem.updateMany({
          where: { id: item.id, consumedAt: null },
          data: { consumedAt: now },
        });
        if (consumed.count !== 1) {
          throw new ReviewApplicationError(
            "INVALID_STATE",
            "Session item was already reviewed",
          );
        }
        await tx.reviewSession.update({
          where: { id_userId: { id: data.sessionId, userId: data.userId } },
          data: {
            correctAnswers: { increment: Number(outcome.isCorrect) },
            wrongAnswers: { increment: Number(!outcome.isCorrect) },
            xpEarned: { increment: outcome.xpEarned },
          },
        });
        const gamification = await applyGamification(
          tx,
          data.userId,
          {
            learnedWord: progress.status === "NEW",
            reviewedWord: true,
            masteredWord:
              progress.status !== "MASTERED" && outcome.status === "MASTERED",
          },
          outcome.xpEarned,
          now,
        );

        return {
          id: attempt.id,
          clientRequestId: attempt.clientRequestId,
          sessionId: attempt.sessionId,
          vocabularyId: data.vocabularyId,
          rating: attempt.rating,
          isCorrect: attempt.isCorrect,
          masteryBefore: attempt.masteryBefore,
          masteryAfter: attempt.masteryAfter,
          xpEarned: attempt.xpEarned,
          totalXp: gamification.totalXp,
          level: gamification.level,
          streak: gamification.streak,
          status: updatedProgress.status,
          nextReviewAt: attempt.nextReviewAt.toISOString(),
        };
      },
      { isolationLevel: "Serializable" },
    );
  }

  private restoreAttempt(
    input: ReturnType<typeof submitReviewSchema.parse>,
    attempt: Awaited<
      ReturnType<PrismaClient["reviewAttempt"]["findUnique"]>
    > & {
      userVocabulary: {
        vocabularyId: string;
        status: ReviewAttemptDto["status"];
      };
      user: { xp: number; level: number; streak: number };
    },
  ): ReviewAttemptDto {
    if (
      attempt.userId !== input.userId ||
      attempt.sessionId !== input.sessionId ||
      attempt.userVocabulary.vocabularyId !== input.vocabularyId ||
      attempt.rating !== input.rating
    ) {
      throw new ReviewApplicationError(
        "CONFLICT",
        "clientRequestId already belongs to another review",
      );
    }

    return {
      id: attempt.id,
      clientRequestId: attempt.clientRequestId,
      sessionId: attempt.sessionId,
      vocabularyId: attempt.userVocabulary.vocabularyId,
      rating: attempt.rating,
      isCorrect: attempt.isCorrect,
      masteryBefore: attempt.masteryBefore,
      masteryAfter: attempt.masteryAfter,
      xpEarned: attempt.xpEarned,
      totalXp: attempt.user.xp,
      level: attempt.user.level,
      streak: attempt.user.streak,
      status: attempt.userVocabulary.status,
      nextReviewAt: attempt.nextReviewAt.toISOString(),
    };
  }

  private isRetryableTransactionError(error: unknown) {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error.code === "P2002" || error.code === "P2034")
    );
  }

  private errorCode(error: unknown) {
    return typeof error === "object" && error !== null && "code" in error
      ? error.code
      : undefined;
  }
}
