"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, useTransition } from "react";

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
  totalCount,
}: Readonly<{
  initialItems: VocabularyCardDto[];
  initialCursor: string | null;
  totalCount: number;
}>) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState(initialCursor);
  const [saved, setSaved] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      initialItems.map((item) => [item.id, item.progress?.isSaved ?? false]),
    ),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const loadingMoreRef = useRef(false);
  const currentCard = Math.min(currentIndex + 1, totalCount);
  const remainingCards = Math.max(totalCount - currentCard, 0);

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
    if (!cursor || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setMessage(null);
    startTransition(async () => {
      try {
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
      } finally {
        loadingMoreRef.current = false;
      }
    });
  }

  return (
    <div className="relative h-full overflow-hidden">
      {message ? (
        <p
          className="pointer-events-none absolute inset-x-4 top-4 z-30 rounded-2xl border border-violet-400/20 bg-zinc-900/95 px-4 py-3 text-sm text-violet-100 shadow-xl backdrop-blur"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
      <div
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth"
        onScroll={(event) => {
          const element = event.currentTarget;
          const nextIndex = Math.round(
            element.scrollTop / element.clientHeight,
          );
          const remaining =
            element.scrollHeight - element.scrollTop - element.clientHeight;

          setCurrentIndex(Math.min(nextIndex, items.length - 1));
          if (remaining < element.clientHeight * 2) loadMore();
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="h-full snap-start snap-always"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.96, y: 28 }
            }
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ amount: 0.65 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            onViewportEnter={() => {
              if (index >= items.length - 3) loadMore();
            }}
          >
            <VocabularyCard
              {...item}
              level={levelLabels[item.level]}
              isSaved={saved[item.id]}
              disabled={pending}
              onRate={rate}
              onToggleSaved={toggleSaved}
            />
          </motion.div>
        ))}
      </div>
      {pending && cursor ? (
        <span className="absolute bottom-36 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur">
          Carregando…
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 border-y border-white/10 bg-zinc-950/85 px-5 py-3 backdrop-blur-xl sm:px-8">
        <div className="mb-2 flex items-center justify-between gap-4 text-xs font-medium">
          <span className="text-zinc-200">
            {currentCard} de {totalCount}
          </span>
          <span className="text-zinc-400">
            {remainingCards === 0
              ? "Último card"
              : `${remainingCards} ${remainingCards === 1 ? "restante" : "restantes"}`}
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Progresso no feed de palavras"
          aria-valuemin={1}
          aria-valuemax={totalCount}
          aria-valuenow={currentCard}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-400"
            initial={false}
            animate={{ width: `${(currentCard / totalCount) * 100}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          />
        </div>
      </div>
    </div>
  );
}
