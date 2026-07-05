"use client";

import {
  Bookmark,
  BookmarkCheck,
  Check,
  HelpCircle,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { SpeakButton } from "./speak-button";

export type VocabularyRating = "unknown" | "almost" | "known";

export interface VocabularyCardProps {
  id: string;
  word: string;
  pronunciation: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  category: string;
  level: string;
  isSaved?: boolean;
  disabled?: boolean;
  onRate?: (id: string, rating: VocabularyRating) => void;
  onToggleSaved?: (id: string) => void;
}

const ratings = [
  {
    value: "unknown",
    label: "Não sei",
    icon: HelpCircle,
    style: "hover:border-rose-400/40 hover:bg-rose-500/10",
  },
  {
    value: "almost",
    label: "Quase",
    icon: Sparkles,
    style: "hover:border-amber-400/40 hover:bg-amber-500/10",
  },
  {
    value: "known",
    label: "Já sei",
    icon: Check,
    style: "hover:border-emerald-400/40 hover:bg-emerald-500/10",
  },
] as const;

export function VocabularyCard({
  id,
  word,
  pronunciation,
  translation,
  example,
  exampleTranslation,
  category,
  level,
  isSaved = false,
  disabled = false,
  onRate,
  onToggleSaved,
}: Readonly<VocabularyCardProps>) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/20 sm:p-7">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <span className="rounded-full bg-white/[0.06] px-3 py-1">
              {category}
            </span>
            <span className="rounded-full bg-violet-500/15 px-3 py-1 text-violet-200">
              {level}
            </span>
          </div>
          <h2 className="break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {word}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{pronunciation}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <SpeakButton text={word} />
          <button
            type="button"
            disabled={disabled || !onToggleSaved}
            onClick={() => onToggleSaved?.(id)}
            aria-label={
              isSaved
                ? `Remover ${word} dos favoritos`
                : `Salvar ${word} nos favoritos`
            }
            aria-pressed={isSaved}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaved ? (
              <BookmarkCheck aria-hidden size={19} />
            ) : (
              <Bookmark aria-hidden size={19} />
            )}
          </button>
        </div>
      </header>

      <div className="my-7 h-px bg-white/10" />
      <p className="text-xl font-semibold text-violet-100">{translation}</p>
      <figure className="mt-5 rounded-2xl border-l-2 border-violet-400 bg-violet-500/[0.07] p-4">
        <blockquote className="leading-7 text-zinc-100">“{example}”</blockquote>
        <figcaption className="mt-2 text-sm leading-6 text-zinc-400">
          {exampleTranslation}
        </figcaption>
      </figure>

      <div
        className="mt-7 grid grid-cols-3 gap-2"
        aria-label={`Avaliar conhecimento de ${word}`}
      >
        {ratings.map(({ value, label, icon: Icon, style }) => (
          <button
            key={value}
            type="button"
            disabled={disabled || !onRate}
            onClick={() => onRate?.(id, value)}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.035] px-2 py-2 text-xs font-semibold text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-row sm:text-sm",
              style,
            )}
          >
            <Icon aria-hidden size={17} />
            {label}
          </button>
        ))}
      </div>
    </article>
  );
}
