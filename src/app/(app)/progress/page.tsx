import { BookOpenCheck, Brain, Clock3, Target } from "lucide-react";
import type { Metadata } from "next";

import { MissionCard } from "@/components/fluenty/mission-card";
import { PageHeading } from "@/components/fluenty/page-heading";
import { ProgressOverview } from "@/components/fluenty/progress-overview";
import { StatCard } from "@/components/fluenty/stat-card";
import { getProgressSnapshot } from "@/features/review/server/review-api";

export const metadata: Metadata = {
  title: "Progresso",
  description: "Acompanhe seu XP, sequência, missões e domínio do inglês.",
};

export default async function ProgressPage() {
  const progress = await getProgressSnapshot();

  return (
    <>
      <PageHeading
        eyebrow="Sua evolução"
        title="Progresso"
        description="Um retrato do que você aprendeu, revisou e está prestes a dominar."
      />
      <ProgressOverview
        level={progress.level}
        totalXp={progress.xp}
        xpIntoLevel={progress.xp % 500}
        xpForNextLevel={500}
        streak={progress.streak}
        weeklyActivity={progress.weeklyActivity}
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard
          icon={BookOpenCheck}
          label="Aprendidas"
          value={progress.learnedWords}
        />
        <StatCard
          icon={Clock3}
          label="Para revisar"
          value={progress.dueWords}
        />
        <StatCard
          icon={Brain}
          label="Dominadas"
          value={progress.masteredWords}
        />
        <StatCard
          icon={Target}
          label="Taxa de acerto"
          value={`${progress.accuracy}%`}
          hint={`${progress.weeklyXp} XP nesta semana`}
        />
      </div>
      {progress.topCategories.length ? (
        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-semibold text-white">
            Categorias mais estudadas
          </h2>
          <div className="mt-4 space-y-3">
            {progress.topCategories.map(({ category, count }) => (
              <div
                key={category}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-zinc-300">{category}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-1 tabular-nums text-zinc-400">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Missões de hoje
        </h2>
        <div className="space-y-3">
          {progress.missions.map((mission) => (
            <MissionCard
              key={mission.code}
              id={mission.code}
              {...mission}
              rewardClaimed={mission.completed}
            />
          ))}
        </div>
      </section>
    </>
  );
}
