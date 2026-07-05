"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function SpeakButton({
  text,
  className,
}: Readonly<{
  text: string;
  className?: string;
}>) {
  const [speaking, setSpeaking] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  function speak() {
    if (!("speechSynthesis" in window)) {
      setUnavailable(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <>
      <button
        type="button"
        onClick={speak}
        disabled={unavailable}
        aria-label={
          unavailable
            ? "Pronúncia não disponível neste navegador"
            : `Ouvir pronúncia de ${text}`
        }
        aria-pressed={speaking}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-violet-200 transition hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-50",
          speaking && "animate-pulse bg-violet-500/25 motion-reduce:animate-none",
          className,
        )}
      >
        <Volume2 aria-hidden size={19} />
      </button>
      <span className="sr-only" aria-live="polite">
        {unavailable ? "A pronúncia por voz não está disponível." : ""}
      </span>
    </>
  );
}
