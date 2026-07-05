import { Flame, Sparkles } from "lucide-react";

import { BottomNavigation } from "@/components/fluenty/bottom-navigation";

export type AppShellUser = Readonly<{
  name: string;
  xp: number;
  level: number;
  streak: number;
}>;

export function AppShell({
  user,
  children,
}: Readonly<{
  user: AppShellUser;
  children: React.ReactNode;
}>) {
  const levelProgress = Math.max(
    0,
    Math.min(100, ((user.xp % 500) / 500) * 100),
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col border-x border-white/5 bg-zinc-950/55 shadow-2xl shadow-black/30">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-transform focus:translate-y-0 motion-reduce:transition-none"
      >
        Ir para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300">
              Fluenty
            </p>
            <p className="truncate text-sm text-zinc-400">Olá, {user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-sm font-semibold text-orange-200"
              aria-label={`${user.streak} dias de sequência`}
              title={`${user.streak} dias de sequência`}
            >
              <Flame aria-hidden size={16} />
              <span>{user.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm font-semibold text-violet-200">
              <Sparkles aria-hidden size={16} />
              <span>Nv. {user.level}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Progresso para o próximo nível"
            aria-valuemin={0}
            aria-valuemax={500}
            aria-valuenow={user.xp % 500}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-[width]"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-zinc-400">
            {user.xp % 500}/500 XP
          </span>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 px-4 pb-28 pt-6 outline-none sm:px-6"
      >
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
