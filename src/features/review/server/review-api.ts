import "server-only";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressService } from "@/features/progress/application/progress-service";
import { ReviewService } from "../application/review-service";
import type { VocabularyFiltersInput } from "../application/schemas";

const reviewService = new ReviewService(prisma);
const progressService = new ProgressService(prisma);

async function authenticatedUserId() {
  const user = await requireAuth();
  return user.id;
}

export async function listVocabulary(
  filters: Omit<VocabularyFiltersInput, "userId"> = {},
) {
  return reviewService.listVocabulary({
    ...filters,
    userId: await authenticatedUserId(),
  });
}

export async function listDueVocabulary(limit = 20) {
  return reviewService.listDueVocabulary(await authenticatedUserId(), limit);
}

export async function getProgressSnapshot() {
  return progressService.getSnapshot(await authenticatedUserId());
}

export async function listVocabularyCategories() {
  await authenticatedUserId();
  const categories = await prisma.vocabulary.findMany({
    distinct: ["category"],
    orderBy: { category: "asc" },
    select: { category: true },
  });
  return categories.map(({ category }) => category);
}
