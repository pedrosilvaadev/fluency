"use client";

import { ErrorState } from "@/components/fluenty/error-state";

export default function ProtectedAreaError({
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  return (
    <ErrorState
      title="Não foi possível carregar esta área"
      description="Confira sua conexão e tente novamente. Seu progresso salvo está seguro."
      onRetry={unstable_retry}
    />
  );
}
