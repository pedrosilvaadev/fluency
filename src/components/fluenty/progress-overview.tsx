import { Flame, Star } from "lucide-react";

export interface ProgressPoint {
  label: string;
  value: number;
}

export interface ProgressOverviewProps {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  streak: number;
  weeklyActivity: readonly ProgressPoint[];
}

export function ProgressOverview({
  level,
  totalXp,
  xpIntoLevel,
  xpForNextLevel,
  streak,
  weeklyActivity,
}: Readonly<ProgressOverviewProps>) {
  const xpGoal = Math.max(1, xpForNextLevel);
  const xpProgress = Math.min(100, Math.max(0, (xpIntoLevel / xpGoal) * 100));
  const maxActivity = Math.max(
    1,
    ...weeklyActivity.map((point) => point.value),
  );

  return (
    <section
      className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6"
      aria-labelledby="progress-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p id="progress-title" className="text-sm font-medium text-zinc-400">
            Seu progresso
          </p>
          <p className="mt-1 text-3xl font-bold text-white">Nível {level}</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-200">
            <Star aria-hidden size={16} />
            {totalXp} XP
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-200">
            <Flame aria-hidden size={16} />
            {streak} dias
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs text-zinc-400">
          <span>Próximo nível</span>
          <span className="tabular-nums">
            {xpIntoLevel} / {xpGoal} XP
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Progresso para o próximo nível"
          aria-valuemin={0}
          aria-valuemax={xpGoal}
          aria-valuenow={Math.min(xpGoal, Math.max(0, xpIntoLevel))}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-zinc-200">
          Atividade recente
        </h3>
        {weeklyActivity.length ? (
          <div
            className="mt-4 flex h-36 items-end gap-2"
            aria-label="Gráfico de atividade recente"
          >
            {weeklyActivity.map((point) => {
              const height =
                point.value === 0
                  ? 4
                  : Math.max(12, (point.value / maxActivity) * 100);
              return (
                <div
                  key={point.label}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="sr-only">{point.value} atividades</span>
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-violet-400/80"
                    style={{ height: `${height}%` }}
                    aria-hidden
                  />
                  <span className="truncate text-[11px] text-zinc-500">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            A atividade aparecerá aqui após sua primeira sessão.
          </p>
        )}
      </div>
    </section>
  );
}
