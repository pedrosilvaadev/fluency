import { describe, expect, it } from "vitest";

import {
  AchievementType,
  MissionType,
  VocabularyLevel,
} from "../../src/generated/prisma/enums";
import { achievementSeed, dailyMissionSeed, vocabularySeed } from "./data";
import { runSeed, type SeedClient } from "./run-seed";

describe("seed data", () => {
  it("contains at least 50 complete, uniquely named vocabulary entries", () => {
    expect(vocabularySeed.length).toBeGreaterThanOrEqual(50);
    expect(new Set(vocabularySeed.map(({ word }) => word)).size).toBe(
      vocabularySeed.length,
    );

    for (const entry of vocabularySeed) {
      expect(
        Object.values(entry).every((value) => String(value).trim().length > 0),
      ).toBe(true);
    }
  });

  it("covers every vocabulary level and several categories", () => {
    const levels = new Set(vocabularySeed.map(({ level }) => level));
    const categories = new Set(vocabularySeed.map(({ category }) => category));

    expect(levels).toEqual(new Set(Object.values(VocabularyLevel)));
    expect(categories.size).toBeGreaterThanOrEqual(8);

    for (const level of Object.values(VocabularyLevel)) {
      expect(
        vocabularySeed.filter((entry) => entry.level === level).length,
      ).toBeGreaterThanOrEqual(10);
    }
  });

  it("defines unique achievements and missions covering every supported type", () => {
    expect(new Set(achievementSeed.map(({ code }) => code)).size).toBe(
      achievementSeed.length,
    );
    expect(new Set(dailyMissionSeed.map(({ code }) => code)).size).toBe(
      dailyMissionSeed.length,
    );
    expect(new Set(achievementSeed.map(({ type }) => type))).toEqual(
      new Set(Object.values(AchievementType)),
    );
    expect(new Set(dailyMissionSeed.map(({ type }) => type))).toEqual(
      new Set(Object.values(MissionType)),
    );

    for (const entry of achievementSeed) {
      expect(entry.requiredValue).toBeGreaterThan(0);
    }
    for (const entry of dailyMissionSeed) {
      expect(entry.targetValue).toBeGreaterThan(0);
      expect(entry.xpReward).toBeGreaterThan(0);
    }
  });
});

describe("runSeed", () => {
  it("is logically idempotent when executed repeatedly", async () => {
    const vocabulary = new Map<string, unknown>();
    const achievements = new Map<string, unknown>();
    const missions = new Map<string, unknown>();

    const upsertBy = (store: Map<string, unknown>, key: "word" | "code") => ({
      upsert: async ({ create }: { create: Record<string, unknown> }) => {
        store.set(String(create[key]), create);
      },
    });

    const client = {
      vocabulary: upsertBy(vocabulary, "word"),
      achievement: upsertBy(achievements, "code"),
      dailyMission: upsertBy(missions, "code"),
    } as unknown as SeedClient;

    const firstRun = await runSeed(client);
    const secondRun = await runSeed(client);

    expect(secondRun).toEqual(firstRun);
    expect(vocabulary.size).toBe(vocabularySeed.length);
    expect(achievements.size).toBe(achievementSeed.length);
    expect(missions.size).toBe(dailyMissionSeed.length);
  });
});
