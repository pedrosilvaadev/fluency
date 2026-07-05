"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { VocabularyCardDto } from "@/features/review/application/contracts";
import {
  loadVocabularyPageAction,
  rateFeedVocabularyAction,
  setVocabularySavedAction,
} from "@/features/review/server/actions";
import { VocabularyCard, type VocabularyRating } from "./vocabulary-card";

const ratingMap = {
  unknown: "AGAIN",
  almost: "HARD",
  known: "EASY",
} as const;

const levelLabels = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
} as const;

export function FeedList({
  initialItems,
  initialCursor,
}: Readonly<{
  initialItems: VocabularyCardDto[];
  initialCursor: string | null;
}>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [saved, setSaved] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      initialItems.map((item) => [item.id, item.progress?.isSaved ?? false]),
    ),
  );
  const [message, setMessage] = useState<string | null>(null);

  function rate(id: string, rating: VocabularyRating) {
    setMessage(null);
    startTransition(async () => {
      const result = await rateFeedVocabularyAction(id, ratingMap[rating]);
      setMessage(
        result.success
          ? "Resposta registrada. A palavra entrou na sua fila de revisão."
          : result.message,
      );
      if (result.success) router.refresh();
    });
  }

  function toggleSaved(id: string) {
    const next = !saved[id];
    setSaved((current) => ({ ...current, [id]: next }));
    setMessage(null);
    startTransition(async () => {
      const result = await setVocabularySavedAction(id, next);
      if (!result.success) {
        setSaved((current) => ({ ...current, [id]: !next }));
        setMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  function loadMore() {
    if (!cursor) return;
    setMessage(null);
    startTransition(async () => {
      const result = await loadVocabularyPageAction(cursor);
      if (!result.success || !result.data) {
        setMessage(result.success ? "Não há mais palavras." : result.message);
        return;
      }
      const page = result.data;

      setItems((current) => {
        const currentIds = new Set(current.map(({ id }) => id));
        return [
          ...current,
          ...page.items.filter(({ id }) => !currentIds.has(id)),
        ];
      });
      setSaved((current) => ({
        ...current,
        ...Object.fromEntries(
          page.items.map((item) => [
            item.id,
            item.progress?.isSaved ?? false,
          ]),
        ),
      }));
      setCursor(page.nextCursor);
    });
  }

  return (
    <>
      {message ? (
        <p
          className="sticky top-28 z-30 mb-4 rounded-2xl border border-violet-400/20 bg-zinc-900/95 px-4 py-3 text-sm text-violet-100 shadow-xl backdrop-blur"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
      <div className="space-y-6 snap-y snap-proximity">
        {items.map((item) => (
          <div key={item.id} className="snap-start scroll-mt-32">
            <VocabularyCard
              {...item}
              level={levelLabels[item.level]}
              isSaved={saved[item.id]}
              disabled={pending}
              onRate={rate}
              onToggleSaved={toggleSaved}
            />
          </div>
        ))}
      </div>
      {cursor ? (
        <button
          type="button"
          onClick={loadMore}
          disabled={pending}
          className="mt-6 min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-200 hover:bg-white/[0.08] disabled:opacity-60"
        >
          {pending ? "Carregando…" : "Carregar mais palavras"}
        </button>
      ) : null}
    </>
  );
}
