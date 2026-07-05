export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}>) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
