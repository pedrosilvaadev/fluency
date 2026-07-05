import type { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="flex w-full max-w-md flex-col gap-6 rounded-[2rem] border border-white/10 bg-zinc-950/75 p-7 shadow-2xl shadow-violet-950/30 backdrop-blur sm:p-9">
        <div>
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300"
          >
            Fluenty
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-white">{title}</h1>
        </div>
        {children}
        {footer && (
          <div className="text-sm text-zinc-400 [&_a]:text-violet-300 [&_a]:underline">
            {footer}
          </div>
        )}
      </section>
    </main>
  );
}
