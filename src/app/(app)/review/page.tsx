import type { Metadata } from "next";

import { PageHeading } from "@/components/fluenty/page-heading";
import { ReviewFlow } from "@/features/review/components/review-flow";
import { listDueVocabulary } from "@/features/review/server/review-api";

export const metadata: Metadata = {
  title: "Revisão",
  description: "Revise seu vocabulário com repetição espaçada.",
};

export default async function ReviewPage() {
  const dueVocabulary = await listDueVocabulary(30);

  return (
    <>
      <PageHeading
        eyebrow="Repetição espaçada"
        title="Hora de revisar"
        description="Responda com honestidade. O próximo intervalo se adapta ao seu domínio."
      />
      <ReviewFlow items={dueVocabulary} />
    </>
  );
}
