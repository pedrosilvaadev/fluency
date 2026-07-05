import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/fluenty/empty-state";
import { PageHeading } from "@/components/fluenty/page-heading";
import { listVocabulary } from "@/features/review/server/review-api";
import { FeedList } from "@/features/vocabulary/components/feed-list";

export const metadata: Metadata = {
  title: "Feed",
  description: "Descubra e avalie novas palavras em inglês.",
};

export default async function FeedPage() {
  const vocabulary = await listVocabulary({ limit: 20 });

  return (
    <>
      <PageHeading
        eyebrow="Descobrir"
        title="Seu feed de palavras"
        description="Avalie o que você já sabe. Cada resposta alimenta sua revisão inteligente."
      />
      {vocabulary.items.length ? (
        <FeedList
          initialItems={vocabulary.items}
          initialCursor={vocabulary.nextCursor}
        />
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma palavra disponível"
          description="O catálogo ainda está vazio. Execute o seed para começar."
        />
      )}
    </>
  );
}
