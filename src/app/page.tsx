export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-violet-950/30 backdrop-blur">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
          Fluenty
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Sua jornada para um inglês mais fluente começa aqui.
        </h1>
        <p className="mt-5 text-base leading-7 text-zinc-300">
          A fundação está pronta para conectar vocabulário, revisão espaçada e
          progresso real em uma experiência gamificada.
        </p>
      </section>
    </main>
  );
}
