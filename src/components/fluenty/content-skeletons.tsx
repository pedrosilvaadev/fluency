function SkeletonBlock({ className }: Readonly<{ className: string }>) {
  return (
    <div
      className={`animate-pulse bg-white/[0.07] motion-reduce:animate-none ${className}`}
      aria-hidden
    />
  );
}

export function VocabularyCardSkeleton() {
  return (
    <div
      className="rounded-[2rem] border border-white/10 bg-white/[0.025] p-5 sm:p-7"
      aria-label="Carregando palavra"
      aria-busy="true"
    >
      <SkeletonBlock className="h-5 w-28 rounded-full" />
      <SkeletonBlock className="mt-5 h-10 w-48 max-w-full rounded-xl" />
      <SkeletonBlock className="mt-3 h-4 w-24 rounded-lg" />
      <SkeletonBlock className="mt-10 h-6 w-40 rounded-lg" />
      <SkeletonBlock className="mt-5 h-24 w-full rounded-2xl" />
      <div className="mt-7 grid grid-cols-3 gap-2">
        <SkeletonBlock className="h-14 rounded-2xl" />
        <SkeletonBlock className="h-14 rounded-2xl" />
        <SkeletonBlock className="h-14 rounded-2xl" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 4 }: Readonly<{ items?: number }>) {
  return (
    <div className="space-y-3" aria-label="Carregando lista" aria-busy="true">
      {Array.from({ length: Math.max(1, items) }, (_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-white/10 bg-white/[0.025] p-5"
        >
          <SkeletonBlock className="h-5 w-36 rounded-lg" />
          <SkeletonBlock className="mt-3 h-4 w-52 max-w-full rounded-lg" />
          <SkeletonBlock className="mt-5 h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-label="Carregando painel" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} className="h-36 rounded-3xl" />
        ))}
      </div>
      <SkeletonBlock className="h-80 rounded-[2rem]" />
    </div>
  );
}
