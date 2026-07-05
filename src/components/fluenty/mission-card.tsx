"use client";

import { Check, Gift, Target } from "lucide-react";

export interface MissionCardProps {
  id: string;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  xpReward: number;
  completed: boolean;
  rewardClaimed: boolean;
  disabled?: boolean;
  onClaim?: (id: string) => void;
}

export function MissionCard({
  id,
  title,
  description,
  currentValue,
  targetValue,
  xpReward,
  completed,
  rewardClaimed,
  disabled = false,
  onClaim,
}: Readonly<MissionCardProps>) {
  const goal = Math.max(1, targetValue);
  const current = Math.min(goal, Math.max(0, currentValue));
  const progress = (current / goal) * 100;

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${completed ? "bg-emerald-500/15 text-emerald-200" : "bg-violet-500/15 text-violet-200"}`}
        >
          {completed ? (
            <Check aria-hidden size={20} />
          ) : (
            <Target aria-hidden size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-white">{title}</h3>
            <span className="shrink-0 text-xs font-semibold text-amber-200">
              +{xpReward} XP
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label={`Progresso: ${title}`}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-valuenow={current}
        >
          <div
            className={`h-full rounded-full ${completed ? "bg-emerald-400" : "bg-violet-400"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs tabular-nums text-zinc-400">
          {current}/{goal}
        </span>
      </div>
      {completed ? (
        <button
          type="button"
          disabled={disabled || rewardClaimed || !onClaim}
          onClick={() => onClaim?.(id)}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {rewardClaimed ? (
            <>
              <Check aria-hidden size={16} /> Recompensa recebida
            </>
          ) : (
            <>
              <Gift aria-hidden size={16} /> Resgatar recompensa
            </>
          )}
        </button>
      ) : null}
    </article>
  );
}
