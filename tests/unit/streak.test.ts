import { describe, expect, it } from "vitest";

import {
  DEFAULT_TIME_ZONE,
  updateDailyStreak,
} from "@/features/progress/domain/streak";

describe("updateDailyStreak", () => {
  it("starts a streak on the first activity", () => {
    expect(
      updateDailyStreak(
        { streak: 0, lastActivityAt: null },
        new Date("2026-07-04T12:00:00.000Z"),
      ),
    ).toEqual({
      streak: 1,
      activityDate: "2026-07-04",
      changed: true,
    });
  });

  it("does not increment twice on the same local day", () => {
    const result = updateDailyStreak(
      {
        streak: 4,
        lastActivityAt: new Date("2026-07-04T03:30:00.000Z"),
      },
      new Date("2026-07-05T02:59:00.000Z"),
      DEFAULT_TIME_ZONE,
    );

    expect(result).toEqual({
      streak: 4,
      activityDate: "2026-07-04",
      changed: false,
    });
  });

  it("increments after midnight in the configured timezone", () => {
    const result = updateDailyStreak(
      {
        streak: 4,
        lastActivityAt: new Date("2026-07-05T02:59:00.000Z"),
      },
      new Date("2026-07-05T03:01:00.000Z"),
      "America/Sao_Paulo",
    );

    expect(result).toEqual({
      streak: 5,
      activityDate: "2026-07-05",
      changed: true,
    });
  });

  it("resets the streak after a missed local day", () => {
    const result = updateDailyStreak(
      {
        streak: 12,
        lastActivityAt: new Date("2026-07-01T15:00:00.000Z"),
      },
      new Date("2026-07-04T15:00:00.000Z"),
    );

    expect(result.streak).toBe(1);
    expect(result.changed).toBe(true);
  });

  it("uses the requested timezone instead of the machine timezone", () => {
    const state = {
      streak: 2,
      lastActivityAt: new Date("2026-01-01T12:00:00.000Z"),
    };
    const now = new Date("2026-01-02T08:30:00.000Z");

    expect(updateDailyStreak(state, now, "Pacific/Honolulu").streak).toBe(2);
    expect(updateDailyStreak(state, now, "Europe/London").streak).toBe(3);
  });
});
