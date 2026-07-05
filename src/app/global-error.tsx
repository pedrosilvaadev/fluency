"use client";

export default function GlobalError({
  unstable_retry,
}: Readonly<{
  error: Error & { digest?: string };
  unstable_retry: () => void;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-white">
        <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">
            Algo deu errado
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Não conseguimos abrir o Fluenty
          </h1>
          <p className="mt-3 max-w-md leading-7 text-zinc-300">
            Tente carregar novamente. O progresso já salvo permanece seguro.
          </p>
          <button
            type="button"
            onClick={unstable_retry}
            className="mt-7 rounded-full bg-violet-500 px-6 py-3 font-semibold text-white hover:bg-violet-400"
          >
            Tentar novamente
          </button>
        </main>
      </body>
    </html>
  );
}
