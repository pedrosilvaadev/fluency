import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
        Erro 404
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white">
        Esta página saiu para praticar
      </h1>
      <p className="mt-3 max-w-md leading-7 text-zinc-400">
        O endereço não existe ou mudou. Volte ao seu feed para continuar de onde
        parou.
      </p>
      <Link
        href="/feed"
        className="mt-7 rounded-full bg-violet-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-400"
      >
        Voltar ao feed
      </Link>
    </main>
  );
}
