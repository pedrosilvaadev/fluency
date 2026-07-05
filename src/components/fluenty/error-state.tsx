"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Algo não saiu como esperado",
  description,
  retryLabel = "Tentar novamente",
  onRetry,
}: Readonly<ErrorStateProps>) {
  return (
    <div
      role="alert"
      className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-rose-400/15 bg-rose-500/[0.045] px-6 py-10 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-200">
        <AlertTriangle aria-hidden size={23} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
        {description}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <RefreshCw aria-hidden size={16} /> {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
