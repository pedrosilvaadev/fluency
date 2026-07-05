export function LoadingSkeleton() {
  return (
    <div
      className="space-y-4"
      aria-label="Carregando conteúdo"
      aria-busy="true"
    >
      <div className="h-8 w-48 animate-pulse rounded-xl bg-white/10 motion-reduce:animate-none" />
      <div className="h-4 w-72 max-w-full animate-pulse rounded-lg bg-white/5 motion-reduce:animate-none" />
      <div className="mt-8 h-72 animate-pulse rounded-3xl border border-white/5 bg-white/[0.04] motion-reduce:animate-none" />
    </div>
  );
}
