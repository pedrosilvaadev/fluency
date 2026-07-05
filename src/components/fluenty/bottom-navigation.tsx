"use client";

import { BarChart3, BookOpen, House, Library, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/feed", label: "Feed", icon: House },
  { href: "/review", label: "Revisão", icon: BookOpen },
  { href: "/progress", label: "Progresso", icon: BarChart3 },
  { href: "/library", label: "Biblioteca", icon: Library },
  { href: "/profile", label: "Perfil", icon: UserRound },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-2xl border-t border-white/10 bg-zinc-950/90 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
    >
      <ul className="grid grid-cols-5 gap-1">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.65rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                  active
                    ? "bg-violet-500/15 text-violet-200"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                )}
              >
                <Icon aria-hidden size={19} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
