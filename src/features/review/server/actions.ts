"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { ReviewApplicationError } from "@/features/review/application/errors";
import type { VocabularyPageDto } from "@/features/review/application/contracts";
import { ReviewService } from "@/features/review/application/review-service";
import type { ReviewRating } from "@/features/review/domain/review-policy";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/action-result";

const service = new ReviewService(prisma);

function messageFor(error: unknown) {
  if (error instanceof ZodError) return "Os dados enviados são inválidos.";
  if (error instanceof ReviewApplicationError) {
    if (error.code === "NOT_FOUND")
      return "O item solicitado não foi encontrado.";
    if (error.code === "FORBIDDEN") return "Você não pode acessar este item.";
    if (error.code === "CONFLICT") return "Essa ação já foi processada.";
    return "Esta ação não está disponível neste momento.";
  }
  console.error("Review action failed", error);
  return "Não foi possível concluir a ação. Tente novamente.";
}

export async function loadVocabularyPageAction(
  cursor: string,
): Promise<ActionResult<VocabularyPageDto>> {
  const user = await requireAuth();
  try {
    const data = await service.listVocabulary({
      userId: user.id,
      cursor,
      limit: 20,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: messageFor(error) };
  }
}

export async function setVocabularySavedAction(
  vocabularyId: string,
  isSaved: boolean,
): Promise<ActionResult<{ isSaved: boolean }>> {
  const user = await requireAuth();
  try {
    const data = await service.setSaved({
      userId: user.id,
      vocabularyId,
      isSaved,
    });
    revalidatePath("/feed");
    revalidatePath("/library");
    return { success: true, data };
  } catch (error) {
    return { success: false, message: messageFor(error) };
  }
}

export async function rateFeedVocabularyAction(
  vocabularyId: string,
  rating: Exclude<ReviewRating, "MASTERED">,
): Promise<ActionResult> {
  const user = await requireAuth();
  try {
    const session = await service.createSession({
      userId: user.id,
      source: "FEED",
      vocabularyIds: [vocabularyId],
    });
    await service.submitReview({
      userId: user.id,
      sessionId: session.id,
      vocabularyId,
      clientRequestId: randomUUID(),
      rating,
    });
    await service.completeSession({ userId: user.id, sessionId: session.id });
    revalidatePath("/feed");
    revalidatePath("/review");
    revalidatePath("/progress");
    return { success: true };
  } catch (error) {
    return { success: false, message: messageFor(error) };
  }
}

export async function createReviewSessionAction(
  vocabularyIds: string[],
): Promise<ActionResult<{ id: string }>> {
  const user = await requireAuth();
  try {
    const session = await service.createSession({
      userId: user.id,
      source: "REVIEW",
      vocabularyIds,
    });
    return { success: true, data: { id: session.id } };
  } catch (error) {
    return { success: false, message: messageFor(error) };
  }
}

export async function submitReviewAction(input: {
  sessionId: string;
  vocabularyId: string;
  clientRequestId: string;
  rating: ReviewRating;
}): Promise<ActionResult<{ xpEarned: number; totalXp: number }>> {
  const user = await requireAuth();
  try {
    const attempt = await service.submitReview({ ...input, userId: user.id });
    revalidatePath("/review");
    revalidatePath("/progress");
    return {
      success: true,
      data: { xpEarned: attempt.xpEarned, totalXp: attempt.totalXp },
    };
  } catch (error) {
    return { success: false, message: messageFor(error) };
  }
}

export async function completeReviewSessionAction(
  sessionId: string,
): Promise<ActionResult> {
  const user = await requireAuth();
  try {
    await service.completeSession({ userId: user.id, sessionId });
    revalidatePath("/review");
    revalidatePath("/progress");
    return { success: true };
  } catch (error) {
    return { success: false, message: messageFor(error) };
  }
}
