export const REVIEW_RATINGS = ["AGAIN", "HARD", "EASY", "MASTERED"] as const;

export type ReviewRating = (typeof REVIEW_RATINGS)[number];
export type LearningStatus = "NEW" | "LEARNING" | "REVIEWING" | "MASTERED";

export type ReviewProgress = Readonly<{
  mastery: number;
  correctCount: number;
  wrongCount: number;
  totalXp: number;
}>;

export type ReviewOutcome = Readonly<{
  rating: ReviewRating;
  isCorrect: boolean;
  masteryBefore: number;
  masteryAfter: number;
  correctCount: number;
  wrongCount: number;
  xpEarned: number;
  totalXp: number;
  level: number;
  status: LearningStatus;
  nextReviewAt: Date;
}>;

type RatingPolicy = Readonly<{
  intervalMs: number;
  masteryDelta: number;
  xpEarned: number;
  isCorrect: boolean;
  status: Exclude<LearningStatus, "NEW" | "MASTERED">;
}>;

const MIN_MASTERY = 0;
const MAX_MASTERY = 100;
const XP_PER_LEVEL = 500;

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export const REVIEW_POLICY = {
  AGAIN: {
    intervalMs: 10 * MINUTE,
    masteryDelta: -15,
    xpEarned: 0,
    isCorrect: false,
    status: "LEARNING",
  },
  HARD: {
    intervalMs: DAY,
    masteryDelta: 5,
    xpEarned: 5,
    isCorrect: true,
    status: "LEARNING",
  },
  EASY: {
    intervalMs: 3 * DAY,
    masteryDelta: 15,
    xpEarned: 10,
    isCorrect: true,
    status: "REVIEWING",
  },
  MASTERED: {
    intervalMs: 7 * DAY,
    masteryDelta: MAX_MASTERY,
    xpEarned: 20,
    isCorrect: true,
    status: "REVIEWING",
  },
} as const satisfies Record<ReviewRating, RatingPolicy>;

function clampMastery(value: number) {
  return Math.min(MAX_MASTERY, Math.max(MIN_MASTERY, value));
}

export function calculateLevel(totalXp: number) {
  const safeXp = Math.max(0, Math.trunc(totalXp));

  return Math.floor(safeXp / XP_PER_LEVEL) + 1;
}

export function applyReview(
  progress: ReviewProgress,
  rating: ReviewRating,
  now: Date,
): ReviewOutcome {
  const policy = REVIEW_POLICY[rating];
  const masteryBefore = clampMastery(Math.trunc(progress.mastery));
  const masteryAfter =
    rating === "MASTERED"
      ? MAX_MASTERY
      : clampMastery(masteryBefore + policy.masteryDelta);
  const totalXp = Math.max(0, Math.trunc(progress.totalXp)) + policy.xpEarned;

  return {
    rating,
    isCorrect: policy.isCorrect,
    masteryBefore,
    masteryAfter,
    correctCount:
      Math.max(0, Math.trunc(progress.correctCount)) +
      (policy.isCorrect ? 1 : 0),
    wrongCount:
      Math.max(0, Math.trunc(progress.wrongCount)) + (policy.isCorrect ? 0 : 1),
    xpEarned: policy.xpEarned,
    totalXp,
    level: calculateLevel(totalXp),
    status: masteryAfter === MAX_MASTERY ? "MASTERED" : policy.status,
    nextReviewAt: new Date(now.getTime() + policy.intervalMs),
  };
}
