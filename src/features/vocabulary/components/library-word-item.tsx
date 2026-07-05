"use client";

import { BookmarkMinus, ChevronRight } from "lucide-react";

import { SpeakButton } from "./speak-button";

export interface LibraryWordItemProps {
  id: string;
  word: string;
  pronunciation: string;
  translation: string;
  category: string;
  mastery: number;
  disabled?: boolean;
  onOpen?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function LibraryWordItem({
  id,
  word,
  pronunciation,
  translation,
  category,
  mastery,
  disabled = false,
  onOpen,
  onRemove,
}: Readonly<LibraryWordItemProps>) {
  const safeMastery = Math.min(100, Math.max(0, mastery));

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        {onOpen ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onOpen(id)}
            className="min-w-0 flex-1 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            aria-label={`Abrir detalhes de ${word}`}
          >
            <span className="flex items-center gap-2">
              <span className="truncate text-lg font-semibold text-white">
                {word}
              </span>
              <ChevronRight
                aria-hidden
                className="shrink-0 text-zinc-600"
                size={17}
              />
            </span>
            <span className="mt-0.5 block truncate text-xs text-zinc-500">
              {pronunciation}
            </span>
            <span className="mt-2 block truncate text-sm text-zinc-300">
              {translation}
            </span>
          </button>
        ) : (
          <div className="min-w-0 flex-1">
            <span className="block truncate text-lg font-semibold text-white">
              {word}
            </span>
            <span className="mt-0.5 block truncate text-xs text-zinc-400">
              {pronunciation}
            </span>
            <span className="mt-2 block truncate text-sm text-zinc-300">
              {translation}
            </span>
          </div>
        )}
        <SpeakButton text={word} className="h-10 w-10" />
        {onRemove ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRemove(id)}
            aria-label={`Remover ${word} da biblioteca`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-50"
          >
            <BookmarkMinus aria-hidden size={18} />
          </button>
        ) : null}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="shrink-0 text-xs font-medium text-zinc-400">
          {category}
        </span>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label={`Domínio de ${word}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeMastery}
        >
          <div
            className="h-full rounded-full bg-violet-400 motion-reduce:transition-none"
            style={{ width: `${safeMastery}%` }}
          />
        </div>
        <span className="w-9 text-right text-xs tabular-nums text-zinc-400">
          {safeMastery}%
        </span>
      </div>
    </article>
  );
}
