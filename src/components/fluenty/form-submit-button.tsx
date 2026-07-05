"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

export function FormSubmitButton({
  children,
  pendingLabel = "Aguarde…",
  className,
  ariaLabel,
}: Readonly<{
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  ariaLabel?: string;
}>) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      aria-busy={pending}
      className={cn(className, "disabled:cursor-wait disabled:opacity-60")}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
