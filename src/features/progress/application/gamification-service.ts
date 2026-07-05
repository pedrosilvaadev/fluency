import type { Prisma } from "@/generated/prisma/client";

import { calculateLevel } from "@/features/review/domain/review-policy";
import { updateDailyStreakFromDateKey } from "../domain/streak";

type ReviewActivity = Readonly<{
  learnedWord: boolean;
  reviewedWord: boolean;
  masteredWord: boolean;
}>;

export type GamificationUpdate = Readonly<{
  totalXp: number;
  level: number;
  streak: number;
  completedMissionCodes: string[];
  unlockedAchievementCodes: string[];
}>;

function dateOnly(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export async function applyGamification(
  tx: Prisma.TransactionClient,
  userId: string,
  activity: ReviewActivity,
  reviewXp: number,
  now: Date,
): Promise<GamificationUpdate> {
  const user = await tx.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found while applying gamification");
  }

  const streak = updateDailyStreakFromDateKey(
    user.streak,
    user.lastActivityDate?.toISOString().slice(0, 10) ?? null,
    now,
    user.timeZone,
  );
  const missionDate = dateOnly(streak.activityDate);
  const missions = await tx.dailyMission.findMany();
  const completedMissionCodes: string[] = [];
  let missionXp = 0;

  for (const mission of missions) {
    const existing = await tx.userDailyMission.findUnique({
      where: {
        userId_missionId_date: {
          userId,
          missionId: mission.id,
          date: missionDate,
        },
      },
    });
    const increment =
      mission.type === "WORDS_LEARNED"
        ? Number(activity.learnedWord)
        : mission.type === "WORDS_REVIEWED"
          ? Number(activity.reviewedWord)
          : mission.type === "WORDS_MASTERED"
            ? Number(activity.masteredWord)
            : 0;
    const currentValue =
      mission.type === "STREAK_DAYS"
        ? streak.streak
        : (existing?.currentValue ?? 0) + increment;
    const completed = currentValue >= mission.targetValue;
    const newlyCompleted = completed && !existing?.completed;

    await tx.userDailyMission.upsert({
      where: {
        userId_missionId_date: {
          userId,
          missionId: mission.id,
          date: missionDate,
        },
      },
      create: {
        userId,
        missionId: mission.id,
        date: missionDate,
        currentValue,
        completed,
        completedAt: completed ? now : null,
        rewardClaimedAt: newlyCompleted ? now : null,
      },
      update: {
        currentValue,
        completed,
        completedAt: newlyCompleted ? now : existing?.completedAt,
        rewardClaimedAt: newlyCompleted ? now : existing?.rewardClaimedAt,
      },
    });

    if (newlyCompleted) {
      missionXp += mission.xpReward;
      completedMissionCodes.push(mission.code);
    }
  }

  const totalXp = user.xp + reviewXp + missionXp;
  const level = calculateLevel(totalXp);
  await tx.user.update({
    where: { id: userId },
    data: {
      xp: totalXp,
      level,
      streak: streak.streak,
      lastActivityDate: streak.changed ? missionDate : user.lastActivityDate,
    },
  });

  const [learnedWords, reviewsCompleted, masteredWords, achievements] =
    await Promise.all([
      tx.userVocabulary.count({
        where: { userId, status: { not: "NEW" } },
      }),
      tx.reviewAttempt.count({ where: { userId } }),
      tx.userVocabulary.count({ where: { userId, status: "MASTERED" } }),
      tx.achievement.findMany(),
    ]);
  const achievementValues = {
    WORDS_LEARNED: learnedWords,
    REVIEWS_COMPLETED: reviewsCompleted,
    STREAK_DAYS: streak.streak,
    WORDS_MASTERED: masteredWords,
    XP_EARNED: totalXp,
  } as const;
  const unlockedAchievementCodes: string[] = [];

  for (const achievement of achievements) {
    if (achievementValues[achievement.type] < achievement.requiredValue) {
      continue;
    }

    const result = await tx.userAchievement.createMany({
      data: [{ userId, achievementId: achievement.id, unlockedAt: now }],
      skipDuplicates: true,
    });

    if (result.count > 0) {
      unlockedAchievementCodes.push(achievement.code);
    }
  }

  return {
    totalXp,
    level,
    streak: streak.streak,
    completedMissionCodes,
    unlockedAchievementCodes,
  };
}
