import { VocabularyCardSkeleton } from "@/components/fluenty/content-skeletons";

export default function ReviewLoading() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-3xl bg-white/[0.04] motion-reduce:animate-none" />
      <VocabularyCardSkeleton />
    </div>
  );
}
