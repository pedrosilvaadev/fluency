"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DismissibleAlertVariant = "danger" | "info";

const variantStyles = {
  danger: {
    container: "bg-rose-500/10 text-rose-200",
    button:
      "text-rose-100/80 hover:text-rose-50 focus-visible:ring-rose-300",
  },
  info: {
    container:
      "border border-violet-400/20 bg-zinc-900/95 text-violet-100 shadow-xl backdrop-blur",
    button:
      "text-violet-100/80 hover:text-violet-50 focus-visible:ring-violet-400",
  },
} as const;

export function DismissibleAlert({
  children,
  className,
  variant = "danger",
  role,
  ariaLive,
  onDismiss,
}: Readonly<{
  children: ReactNode;
  className?: string;
  variant?: DismissibleAlertVariant;
  role?: "alert" | "status";
  ariaLive?: "polite" | "assertive" | "off";
  onDismiss: () => void;
}>) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl px-4 py-3 text-sm",
        styles.container,
        className,
      )}
      role={role}
      aria-live={ariaLive}
    >
      <p className="min-w-0 flex-1">{children}</p>
      <button
        type="button"
        aria-label="Fechar aviso"
        onClick={onDismiss}
        className={cn(
          "-mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2",
          styles.button,
        )}
      >
        <X aria-hidden size={16} />
      </button>
    </div>
  );
}
