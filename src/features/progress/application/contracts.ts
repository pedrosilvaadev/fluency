export type ProgressSnapshotDto = Readonly<{
  xp: number;
  level: number;
  streak: number;
  learnedWords: number;
  masteredWords: number;
  reviewsCompleted: number;
  dueWords: number;
  accuracy: number;
  weeklyXp: number;
  weeklyActivity: ReadonlyArray<{ label: string; value: number }>;
  topCategories: ReadonlyArray<{ category: string; count: number }>;
  missions: ReadonlyArray<{
    code: string;
    title: string;
    description: string;
    currentValue: number;
    targetValue: number;
    xpReward: number;
    completed: boolean;
  }>;
  achievements: ReadonlyArray<{
    code: string;
    title: string;
    description: string;
    icon: string;
    requiredValue: number;
    unlockedAt: string | null;
  }>;
}>;
