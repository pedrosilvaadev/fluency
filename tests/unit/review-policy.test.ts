import { describe, expect, it } from "vitest";

import {
  applyReview,
  calculateLevel,
  REVIEW_POLICY,
  type ReviewRating,
} from "@/features/review/domain/review-policy";

const NOW = new Date("2026-07-04T12:00:00.000Z");

const baseProgress = {
  mastery: 40,
  correctCount: 2,
  wrongCount: 1,
  totalXp: 490,
} as const;

describe("review policy", () => {
  it.each([
    ["AGAIN", 10 * 60_000],
    ["HARD", 24 * 60 * 60_000],
    ["EASY", 3 * 24 * 60 * 60_000],
    ["MASTERED", 7 * 24 * 60 * 60_000],
  ] satisfies Array<[ReviewRating, number]>)(
    "schedules %s using the planned interval",
    (rating, intervalMs) => {
      const outcome = applyReview(baseProgress, rating, NOW);

      expect(outcome.nextReviewAt.getTime()).toBe(NOW.getTime() + intervalMs);
      expect(REVIEW_POLICY[rating].intervalMs).toBe(intervalMs);
    },
  );

  it("records AGAIN as an error without granting XP", () => {
    const outcome = applyReview(baseProgress, "AGAIN", NOW);

    expect(outcome).toMatchObject({
      isCorrect: false,
      masteryBefore: 40,
      masteryAfter: 25,
      correctCount: 2,
      wrongCount: 2,
      xpEarned: 0,
      totalXp: 490,
      level: 1,
      status: "LEARNING",
    });
  });

  it("records a correct answer and advances the level at each 500 XP", () => {
    const outcome = applyReview(baseProgress, "EASY", NOW);

    expect(outcome).toMatchObject({
      isCorrect: true,
      masteryAfter: 55,
      correctCount: 3,
      wrongCount: 1,
      xpEarned: 10,
      totalXp: 500,
      level: 2,
      status: "REVIEWING",
    });
  });

  it("marks MASTERED explicitly and caps mastery at 100", () => {
    const outcome = applyReview(
      { ...baseProgress, mastery: 12 },
      "MASTERED",
      NOW,
    );

    expect(outcome.masteryAfter).toBe(100);
    expect(outcome.status).toBe("MASTERED");
  });

  it("keeps mastery and counters inside their valid lower bounds", () => {
    const outcome = applyReview(
      {
        mastery: -20,
        correctCount: -4,
        wrongCount: -2,
        totalXp: -100,
      },
      "AGAIN",
      NOW,
    );

    expect(outcome).toMatchObject({
      masteryBefore: 0,
      masteryAfter: 0,
      correctCount: 0,
      wrongCount: 1,
      totalXp: 0,
      level: 1,
    });
  });
});

describe("calculateLevel", () => {
  it.each([
    [0, 1],
    [499, 1],
    [500, 2],
    [1_000, 3],
  ])("maps %i XP to level %i", (xp, expectedLevel) => {
    expect(calculateLevel(xp)).toBe(expectedLevel);
  });
});
