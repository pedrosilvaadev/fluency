import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: Readonly<{
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}>) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/10">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
        <Icon aria-hidden size={18} />
      </div>
      <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-300">{label}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </article>
  );
}
