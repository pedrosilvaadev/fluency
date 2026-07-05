import type { LearningStatus, ReviewRating } from "../domain/review-policy";

export type VocabularyCardDto = Readonly<{
  id: string;
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  category: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  progress: null | Readonly<{
    mastery: number;
    correctCount: number;
    wrongCount: number;
    isSaved: boolean;
    status: LearningStatus;
    nextReviewAt: string | null;
  }>;
}>;

export type VocabularyPageDto = Readonly<{
  items: VocabularyCardDto[];
  nextCursor: string | null;
  totalCount: number;
}>;

export type ReviewAttemptDto = Readonly<{
  id: string;
  clientRequestId: string;
  sessionId: string;
  vocabularyId: string;
  rating: ReviewRating;
  isCorrect: boolean;
  masteryBefore: number;
  masteryAfter: number;
  xpEarned: number;
  totalXp: number;
  level: number;
  streak: number;
  status: LearningStatus;
  nextReviewAt: string;
}>;

export type ReviewSessionDto = Readonly<{
  id: string;
  source: "FEED" | "REVIEW";
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  totalCards: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned: number;
  completedAt: string | null;
}>;
