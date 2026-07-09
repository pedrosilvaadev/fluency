"use client";

import { useRouter } from "next/navigation";
import { Library, X } from "lucide-react";
import { useState, useTransition } from "react";

import { EmptyState } from "@/components/fluenty/empty-state";
import type { VocabularyCardDto } from "@/features/review/application/contracts";
import { setVocabularySavedAction } from "@/features/review/server/actions";
import { LibraryWordItem } from "./library-word-item";

export function LibraryList({
  items,
}: Readonly<{ items: VocabularyCardDto[] }>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [removedIds, setRemovedIds] = useState(() => new Set<string>());
  const [error, setError] = useState<string | null>(null);

  function remove(id: string) {
    setError(null);
    setRemovedIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
    startTransition(async () => {
      const result = await setVocabularySavedAction(id, false);
      if (!result.success) {
        setRemovedIds((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        });
        setError(result.message);
        return;
      }
      setError(null);
      router.refresh();
    });
  }

  const visibleItems = items.filter(({ id }) => !removedIds.has(id));

  return (
    <div className="space-y-3">
      {error ? (
        <div
          className="flex items-start gap-3 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          aria-live="polite"
        >
          <p className="min-w-0 flex-1">{error}</p>
          <button
            type="button"
            aria-label="Fechar aviso"
            onClick={() => setError(null)}
            className="-mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-rose-100/80 transition-colors hover:bg-white/10 hover:text-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            <X aria-hidden size={16} />
          </button>
        </div>
      ) : null}
      {visibleItems.length ? (
        visibleItems.map((item) => (
          <LibraryWordItem
            key={item.id}
            id={item.id}
            word={item.word}
            pronunciation={item.pronunciation}
            translation={item.translation}
            category={item.category}
            mastery={item.progress?.mastery ?? 0}
            disabled={pending}
            onRemove={remove}
          />
        ))
      ) : (
        <EmptyState
          icon={Library}
          title="Biblioteca vazia"
          description="Você removeu todas as palavras desta lista. Salve novas palavras no feed para vê-las aqui."
        />
      )}
    </div>
  );
}
