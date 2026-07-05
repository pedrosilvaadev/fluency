import {
  achievementSeed,
  dailyMissionSeed,
  vocabularySeed,
  type VocabularySeed,
} from "./data";

type AchievementSeed = (typeof achievementSeed)[number];
type DailyMissionSeed = (typeof dailyMissionSeed)[number];

type UpsertDelegate<T> = {
  upsert(args: { where: Partial<T>; update: T; create: T }): Promise<unknown>;
};

export type SeedClient = {
  vocabulary: UpsertDelegate<VocabularySeed>;
  achievement: UpsertDelegate<AchievementSeed>;
  dailyMission: UpsertDelegate<DailyMissionSeed>;
};

export async function runSeed(client: SeedClient) {
  for (const entry of vocabularySeed) {
    await client.vocabulary.upsert({
      where: { word: entry.word },
      update: entry,
      create: entry,
    });
  }

  for (const entry of achievementSeed) {
    await client.achievement.upsert({
      where: { code: entry.code },
      update: entry,
      create: entry,
    });
  }

  for (const entry of dailyMissionSeed) {
    await client.dailyMission.upsert({
      where: { code: entry.code },
      update: entry,
      create: entry,
    });
  }

  return {
    vocabulary: vocabularySeed.length,
    achievements: achievementSeed.length,
    dailyMissions: dailyMissionSeed.length,
  };
}
