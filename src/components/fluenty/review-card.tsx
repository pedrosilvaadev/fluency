"use client";

import { CheckCircle2, Eye, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { useState } from "react";

import { SpeakButton } from "@/features/vocabulary/components/speak-button";

export type ReviewRatingValue = "again" | "hard" | "easy" | "mastered";

export interface ReviewCardProps {
  id: string;
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  currentIndex: number;
  total: number;
  disabled?: boolean;
  onRate?: (id: string, rating: ReviewRatingValue) => void;
}

const reviewActions = [
  {
    value: "again",
    label: "De novo",
    interval: "10 min",
    icon: XCircle,
    color: "hover:bg-rose-500/15 hover:text-rose-200",
  },
  {
    value: "hard",
    label: "Difícil",
    interval: "1 dia",
    icon: RotateCcw,
    color: "hover:bg-amber-500/15 hover:text-amber-200",
  },
  {
    value: "easy",
    label: "Fácil",
    interval: "3 dias",
    icon: CheckCircle2,
    color: "hover:bg-emerald-500/15 hover:text-emerald-200",
  },
  {
    value: "mastered",
    label: "Dominei",
    interval: "7 dias",
    icon: Sparkles,
    color: "hover:bg-violet-500/20 hover:text-violet-100",
  },
] as const;

export function ReviewCard({
  id,
  word,
  pronunciation,
  translation,
  example,
  exampleTranslation,
  currentIndex,
  total,
  disabled = false,
  onRate,
}: Readonly<ReviewCardProps>) {
  const [revealed, setRevealed] = useState(false);
  const safeTotal = Math.max(1, total);
  const safeIndex = Math.min(safeTotal, Math.max(1, currentIndex));

  return (
    <article className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-violet-950/20 sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-4 text-sm text-zinc-400">
        <span className="tabular-nums">
          {safeIndex} de {safeTotal}
        </span>
        <div
          className="h-1.5 max-w-52 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Progresso da revisão"
          aria-valuemin={1}
          aria-valuemax={safeTotal}
          aria-valuenow={safeIndex}
        >
          <div
            className="h-full rounded-full bg-violet-400"
            style={{ width: `${(safeIndex / safeTotal) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex min-h-56 flex-col items-center justify-center text-center">
        <SpeakButton text={word} className="mb-5" />
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {word}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">{pronunciation}</p>

        {revealed ? (
          <div
            className="mt-8 w-full border-t border-white/10 pt-7"
            aria-live="polite"
          >
            <p className="text-xl font-semibold text-violet-100">
              {translation}
            </p>
            <p className="mt-5 leading-7 text-zinc-200">“{example}”</p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {exampleTranslation}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-violet-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <Eye aria-hidden size={18} /> Revelar resposta
          </button>
        )}
      </div>

      {revealed ? (
        <div
          className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4"
          aria-label="Avaliar resposta"
        >
          {reviewActions.map(
            ({ value, label, interval, icon: Icon, color }) => (
              <button
                key={value}
                type="button"
                disabled={disabled || !onRate}
                onClick={() => onRate?.(id, value)}
                className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-2 py-2 text-sm font-semibold text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50 ${color}`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon aria-hidden size={16} />
                  {label}
                </span>
                <span className="mt-1 text-[11px] font-normal text-zinc-400">
                  {interval}
                </span>
              </button>
            ),
          )}
        </div>
      ) : null}
    </article>
  );
}
