import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

import { EmptyState } from "@/components/fluenty/empty-state";
import { listVocabulary } from "@/features/review/server/review-api";
import { FeedList } from "@/features/vocabulary/components/feed-list";

export const metadata: Metadata = {
  title: "Feed",
  description: "Descubra e avalie novas palavras em inglês.",
};

export default async function FeedPage() {
  const vocabulary = await listVocabulary({ limit: 20 });

  return (
    <section className="reels-feed h-full" aria-label="Feed de palavras">
      {vocabulary.items.length ? (
        <FeedList
          initialItems={vocabulary.items}
          initialCursor={vocabulary.nextCursor}
          totalCount={vocabulary.totalCount}
        />
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma palavra disponível"
          description="O catálogo ainda está vazio. Execute o seed para começar."
        />
      )}
    </section>
  );
}
