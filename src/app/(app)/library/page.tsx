import { Library } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import type { Metadata } from "next";

import { EmptyState } from "@/components/fluenty/empty-state";
import { PageHeading } from "@/components/fluenty/page-heading";
import {
  listVocabulary,
  listVocabularyCategories,
} from "@/features/review/server/review-api";
import { LibraryList } from "@/features/vocabulary/components/library-list";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Consulte suas palavras salvas e filtre seu aprendizado.",
};

const libraryFiltersSchema = z.object({
  category: z.string().trim().min(1).max(80).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  status: z.enum(["LEARNING", "REVIEWING", "MASTERED"]).optional(),
});

type LibrarySearchParams = Record<string, string | string[] | undefined>;

export default async function LibraryPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<LibrarySearchParams>;
}>) {
  const rawFilters = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const parsedFilters = libraryFiltersSchema.safeParse({
    category: first(rawFilters.category) || undefined,
    level: first(rawFilters.level) || undefined,
    status: first(rawFilters.status) || undefined,
  });
  const filters = parsedFilters.success ? parsedFilters.data : {};
  const [vocabulary, categories] = await Promise.all([
    listVocabulary({ ...filters, savedOnly: true, limit: 50 }),
    listVocabularyCategories(),
  ]);

  return (
    <>
      <PageHeading
        eyebrow="Sua coleção"
        title="Biblioteca"
        description="Encontre suas palavras salvas por categoria, nível ou estágio de aprendizagem."
      />
      <form className="mb-5 grid grid-cols-1 gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-3">
        <FilterSelect
          name="category"
          label="Categoria"
          value={filters.category}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect name="level" label="Nível" value={filters.level}>
          <option value="BEGINNER">Iniciante</option>
          <option value="INTERMEDIATE">Intermediário</option>
          <option value="ADVANCED">Avançado</option>
        </FilterSelect>
        <FilterSelect name="status" label="Status" value={filters.status}>
          <option value="LEARNING">Difíceis</option>
          <option value="REVIEWING">Para revisar</option>
          <option value="MASTERED">Dominadas</option>
        </FilterSelect>
        <button className="min-h-11 rounded-2xl bg-violet-500 px-4 text-sm font-semibold text-white sm:col-span-3">
          Aplicar filtros
        </button>
        {filters.category || filters.level || filters.status ? (
          <Link
            href="/library"
            className="text-center text-sm font-medium text-zinc-300 underline sm:col-span-3"
          >
            Limpar filtros
          </Link>
        ) : null}
      </form>
      {vocabulary.items.length ? (
        <LibraryList items={vocabulary.items} />
      ) : (
        <EmptyState
          icon={Library}
          title="Nenhuma palavra encontrada"
          description="Salve palavras no feed ou remova os filtros para ampliar a busca."
        />
      )}
    </>
  );
}

function FilterSelect({
  name,
  label,
  value,
  children,
}: Readonly<{
  name: string;
  label: string;
  value?: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="text-xs font-medium text-zinc-400">
      <span className="sr-only">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ""}
        className="min-h-11 w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 text-sm text-zinc-200"
      >
        <option value="">{label}: todas</option>
        {children}
      </select>
    </label>
  );
}
