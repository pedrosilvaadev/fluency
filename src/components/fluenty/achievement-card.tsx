import {
  Award,
  BookOpenCheck,
  Flame,
  LockKeyhole,
  Medal,
  Star,
  Trophy,
} from "lucide-react";

export type AchievementIcon =
  "award" | "book" | "flame" | "medal" | "star" | "trophy";

export interface AchievementCardProps {
  title: string;
  description: string;
  icon: AchievementIcon;
  unlocked: boolean;
  unlockedLabel?: string;
}

const icons = {
  award: Award,
  book: BookOpenCheck,
  flame: Flame,
  medal: Medal,
  star: Star,
  trophy: Trophy,
} as const;

export function AchievementCard({
  title,
  description,
  icon,
  unlocked,
  unlockedLabel,
}: Readonly<AchievementCardProps>) {
  const Icon = icons[icon];

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-5 ${unlocked ? "border-amber-400/20 bg-amber-500/[0.07]" : "border-white/10 bg-white/[0.025] opacity-70"}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${unlocked ? "bg-amber-400/15 text-amber-200" : "bg-white/[0.06] text-zinc-500"}`}
      >
        {unlocked ? (
          <Icon aria-hidden size={24} />
        ) : (
          <LockKeyhole aria-hidden size={22} />
        )}
      </div>
      <h3 className="mt-5 font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
      <p className="mt-4 text-xs font-medium text-zinc-500">
        {unlocked
          ? (unlockedLabel ?? "Conquista desbloqueada")
          : "Ainda bloqueada"}
      </p>
      {unlocked ? (
        <span
          className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-300/10 blur-2xl"
          aria-hidden
        />
      ) : null}
    </article>
  );
}
