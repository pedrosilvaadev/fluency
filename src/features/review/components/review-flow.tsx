"use client";

import { BookOpenCheck, PartyPopper, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { EmptyState } from "@/components/fluenty/empty-state";
import {
  ReviewCard,
  type ReviewRatingValue,
} from "@/components/fluenty/review-card";
import type { VocabularyCardDto } from "../application/contracts";
import {
  completeReviewSessionAction,
  createReviewSessionAction,
  submitReviewAction,
} from "../server/actions";

const ratings = {
  again: "AGAIN",
  hard: "HARD",
  easy: "EASY",
  mastered: "MASTERED",
} as const;

export function ReviewFlow({
  items,
}: Readonly<{ items: VocabularyCardDto[] }>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const requestIds = useRef(new Map<string, string>());

  if (!items.length) {
    return (
      <EmptyState
        icon={BookOpenCheck}
        title="Tudo revisado por agora"
        description="Sua fila está em dia. Volte mais tarde ou avalie novas palavras no feed."
      />
    );
  }

  function start() {
    setMessage(null);
    startTransition(async () => {
      const result = await createReviewSessionAction(items.map(({ id }) => id));
      if (!result.success || !result.data) {
        setMessage(
          result.success
            ? "Não foi possível iniciar a sessão."
            : result.message,
        );
        return;
      }
      setSessionId(result.data.id);
    });
  }

  function rate(vocabularyId: string, rating: ReviewRatingValue) {
    if (!sessionId) return;
    setMessage(null);
    startTransition(async () => {
      const requestKey = `${sessionId}:${vocabularyId}`;
      const clientRequestId =
        requestIds.current.get(requestKey) ?? crypto.randomUUID();
      requestIds.current.set(requestKey, clientRequestId);

      const result = await submitReviewAction({
        sessionId,
        vocabularyId,
        clientRequestId,
        rating: ratings[rating],
      });
      if (!result.success) {
        setMessage(result.message);
        return;
      }

      requestIds.current.delete(requestKey);
      const xpEarned = result.data?.xpEarned ?? 0;
      setLastXpEarned(xpEarned);
      setSessionXp((current) => current + xpEarned);

      if (index + 1 >= items.length) {
        const completed = await completeReviewSessionAction(sessionId);
        if (!completed.success) {
          setMessage(completed.message);
          return;
        }
        setFinished(true);
        router.refresh();
        return;
      }
      setIndex((current) => current + 1);
    });
  }

  if (finished) {
    return (
      <div className="relative overflow-hidden rounded-3xl" aria-live="polite">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 14 }, (_, confettiIndex) => (
            <span
              key={confettiIndex}
              className="review-confetti absolute h-2.5 w-2.5 rounded-sm"
              style={
                {
                  "--confetti-x": `${6 + ((confettiIndex * 37) % 88)}%`,
                  "--confetti-delay": `${(confettiIndex % 7) * 70}ms`,
                  "--confetti-color": confettiIndex % 2 ? "#c084fc" : "#fbbf24",
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <EmptyState
          icon={PartyPopper}
          title="Sessão concluída"
          description={`Você ganhou ${sessionXp} XP. Seu streak, missões e conquistas também foram atualizados.`}
          action={
            <button
              type="button"
              onClick={() => router.push("/progress")}
              className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-400 motion-reduce:transform-none"
            >
              Ver progresso
            </button>
          }
        />
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center">
        <BookOpenCheck
          className="mx-auto text-violet-300"
          size={36}
          aria-hidden
        />
        <h2 className="mt-5 text-2xl font-bold text-white">
          {items.length} palavras esperando
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Reserve alguns minutos. A sessão salva cada resposta imediatamente.
        </p>
        {message ? (
          <p className="mt-4 text-sm text-rose-200" role="alert">
            {message}
          </p>
        ) : null}
        <button
          type="button"
          onClick={start}
          disabled={pending}
          aria-busy={pending}
          className="mt-6 min-h-12 rounded-full bg-violet-500 px-7 py-3 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Preparando…" : "Começar revisão"}
        </button>
      </div>
    );
  }

  const item = items[index];
  if (!item) return null;

  return (
    <div aria-busy={pending}>
      <div className="mb-3 min-h-6" aria-live="polite" aria-atomic="true">
        {pending ? (
          <p className="text-sm text-zinc-300">Salvando resposta…</p>
        ) : lastXpEarned > 0 ? (
          <p className="review-xp-pop inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-sm font-semibold text-violet-200">
            <Sparkles aria-hidden size={15} />+{lastXpEarned} XP
          </p>
        ) : null}
      </div>
      {message ? (
        <p
          className="mb-4 rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200"
          role="alert"
        >
          {message}
        </p>
      ) : null}
      <ReviewCard
        key={item.id}
        id={item.id}
        word={item.word}
        pronunciation={item.pronunciation}
        translation={item.translation}
        example={item.example}
        exampleTranslation={item.exampleTranslation}
        currentIndex={index + 1}
        total={items.length}
        disabled={pending}
        onRate={rate}
      />
    </div>
  );
}
