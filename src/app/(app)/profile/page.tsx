import { Award, LogOut } from "lucide-react";
import type { Metadata } from "next";

import { signOutAction } from "@/actions/auth";
import {
  AchievementCard,
  type AchievementIcon,
} from "@/components/fluenty/achievement-card";
import { EmptyState } from "@/components/fluenty/empty-state";
import { FormSubmitButton } from "@/components/fluenty/form-submit-button";
import { PageHeading } from "@/components/fluenty/page-heading";
import { getProgressSnapshot } from "@/features/review/server/review-api";
import { getCurrentUser } from "@/lib/dal/users";

export const metadata: Metadata = {
  title: "Perfil",
  description: "Veja sua conta e suas conquistas no Fluenty.",
};

export default async function ProfilePage() {
  const [user, progress] = await Promise.all([
    getCurrentUser(),
    getProgressSnapshot(),
  ]);

  return (
    <>
      <PageHeading
        eyebrow="Conta"
        title={user.name}
        description={`${user.email} · ${user.timeZone}`}
        action={
          <form action={signOutAction}>
            <FormSubmitButton
              ariaLabel="Sair da conta"
              pendingLabel="…"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              <LogOut aria-hidden size={18} />
            </FormSubmitButton>
          </form>
        }
      />
      <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-5 text-center">
        <ProfileMetric label="Nível" value={user.level} />
        <ProfileMetric label="XP" value={user.xp} />
        <ProfileMetric label="Streak" value={user.streak} />
      </div>
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Conquistas</h2>
        {progress.achievements.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {progress.achievements.map((achievement) => (
              <AchievementCard
                key={achievement.code}
                title={achievement.title}
                description={achievement.description}
                icon={achievementIcon(achievement.icon)}
                unlocked={Boolean(achievement.unlockedAt)}
                unlockedLabel={
                  achievement.unlockedAt
                    ? `Desbloqueada em ${new Intl.DateTimeFormat("pt-BR").format(new Date(achievement.unlockedAt))}`
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Award}
            title="Conquistas a caminho"
            description="Continue aprendendo para desbloquear seus primeiros marcos."
          />
        )}
      </section>
    </>
  );
}

function ProfileMetric({
  label,
  value,
}: Readonly<{ label: string; value: number }>) {
  return (
    <div>
      <p className="text-xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{label}</p>
    </div>
  );
}

function achievementIcon(icon: string): AchievementIcon {
  if (icon === "flame") return "flame";
  if (icon === "book-open" || icon === "library") return "book";
  if (icon === "trophy" || icon === "crown") return "trophy";
  if (icon === "calendar-check" || icon === "badge-check") return "medal";
  if (icon === "brain") return "star";
  return "award";
}
