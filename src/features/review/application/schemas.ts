import { z } from "zod";

import { REVIEW_RATINGS } from "../domain/review-policy";

const uuid = z.string().uuid();

export const vocabularyFiltersSchema = z.object({
  userId: uuid,
  cursor: uuid.optional(),
  limit: z.number().int().min(1).max(50).default(20),
  category: z.string().trim().min(1).max(80).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  status: z.enum(["NEW", "LEARNING", "REVIEWING", "MASTERED"]).optional(),
  savedOnly: z.boolean().default(false),
});

export const setVocabularySavedSchema = z.object({
  userId: uuid,
  vocabularyId: uuid,
  isSaved: z.boolean(),
});

export const createReviewSessionSchema = z.object({
  userId: uuid,
  source: z.enum(["FEED", "REVIEW"]),
  vocabularyIds: z.array(uuid).min(1).max(100),
});

export const submitReviewSchema = z.object({
  userId: uuid,
  sessionId: uuid,
  vocabularyId: uuid,
  clientRequestId: uuid,
  rating: z.enum(REVIEW_RATINGS),
});

export const completeReviewSessionSchema = z.object({
  userId: uuid,
  sessionId: uuid,
});

export type VocabularyFiltersInput = z.input<typeof vocabularyFiltersSchema>;
export type SetVocabularySavedInput = z.input<typeof setVocabularySavedSchema>;
export type CreateReviewSessionInput = z.input<
  typeof createReviewSessionSchema
>;
export type SubmitReviewInput = z.input<typeof submitReviewSchema>;
export type CompleteReviewSessionInput = z.input<
  typeof completeReviewSessionSchema
>;
