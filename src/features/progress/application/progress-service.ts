import type { PrismaClient } from "@/generated/prisma/client";
import { z } from "zod";

import {
  dateKeyInTimeZone,
  recentDateKeys,
  updateDailyStreakFromDateKey,
} from "../domain/streak";
import type { ProgressSnapshotDto } from "./contracts";

const userIdSchema = z.string().uuid();

export class ProgressService {
  constructor(
    private readonly db: PrismaClient,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async getSnapshot(userIdInput: string): Promise<ProgressSnapshotDto> {
    const userId = userIdSchema.parse(userIdInput);
    const now = this.clock();
    const user = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        achievements: { include: { achievement: true } },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const dateKey = updateDailyStreakFromDateKey(
      user.streak,
      null,
      now,
      user.timeZone,
    ).activityDate;
    const date = new Date(`${dateKey}T00:00:00.000Z`);
    const weekQueryStart = new Date(now.getTime() - 8 * 86_400_000);
    const [
      learnedWords,
      masteredWords,
      reviewsCompleted,
      dueWords,
      attempts,
      studiedVocabulary,
      missions,
      missionCatalog,
      catalog,
    ] = await Promise.all([
      this.db.userVocabulary.count({
        where: { userId, status: { not: "NEW" } },
      }),
      this.db.userVocabulary.count({
        where: { userId, status: "MASTERED" },
      }),
      this.db.reviewAttempt.count({ where: { userId } }),
      this.db.userVocabulary.count({
        where: { userId, nextReviewAt: { lte: now } },
      }),
      this.db.reviewAttempt.findMany({
          where: { userId, createdAt: { gte: weekQueryStart } },
        select: { createdAt: true, xpEarned: true },
        orderBy: { createdAt: "asc" },
      }),
      this.db.userVocabulary.findMany({
        where: { userId, status: { not: "NEW" } },
        select: { vocabulary: { select: { category: true } } },
      }),
      this.db.userDailyMission.findMany({
        where: { userId, date },
        include: { mission: true },
        orderBy: { mission: { code: "asc" } },
      }),
      this.db.dailyMission.findMany({ orderBy: { code: "asc" } }),
      this.db.achievement.findMany({ orderBy: { requiredValue: "asc" } }),
    ]);
    const correctAttempts = await this.db.reviewAttempt.count({
      where: { userId, isCorrect: true },
    });
    const weekKeys = recentDateKeys(now, 7, user.timeZone);
    const weeklyByDay = new Map(weekKeys.map((key) => [key, 0]));
    for (const attempt of attempts) {
      const key = dateKeyInTimeZone(attempt.createdAt, user.timeZone);
      if (weeklyByDay.has(key)) {
        weeklyByDay.set(key, (weeklyByDay.get(key) ?? 0) + 1);
      }
    }
    const categoryCounts = new Map<string, number>();
    for (const { vocabulary } of studiedVocabulary) {
      categoryCounts.set(
        vocabulary.category,
        (categoryCounts.get(vocabulary.category) ?? 0) + 1,
      );
    }
    const unlocked = new Map(
      user.achievements.map(({ achievement, unlockedAt }) => [
        achievement.id,
        unlockedAt.toISOString(),
      ]),
    );
    const missionProgress = new Map(
      missions.map((record) => [record.missionId, record]),
    );

    return {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      learnedWords,
      masteredWords,
      reviewsCompleted,
      dueWords,
      accuracy:
        reviewsCompleted === 0
          ? 0
          : Math.round((correctAttempts / reviewsCompleted) * 100),
      weeklyXp: attempts.reduce(
        (total, attempt) => total + attempt.xpEarned,
        0,
      ),
      weeklyActivity: Array.from(weeklyByDay, ([key, value]) => ({
        label: new Intl.DateTimeFormat("pt-BR", {
          weekday: "short",
          timeZone: "UTC",
        })
          .format(new Date(`${key}T12:00:00.000Z`))
          .replace(".", ""),
        value,
      })),
      topCategories: Array.from(categoryCounts, ([category, count]) => ({
        category,
        count,
      }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      missions: missionCatalog.map((mission) => ({
        code: mission.code,
        title: mission.title,
        description: mission.description,
        currentValue: missionProgress.get(mission.id)?.currentValue ?? 0,
        targetValue: mission.targetValue,
        xpReward: mission.xpReward,
        completed: missionProgress.get(mission.id)?.completed ?? false,
      })),
      achievements: catalog.map((achievement) => ({
        code: achievement.code,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        requiredValue: achievement.requiredValue,
        unlockedAt: unlocked.get(achievement.id) ?? null,
      })),
    };
  }
}
