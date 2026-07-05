import { ListSkeleton } from "@/components/fluenty/content-skeletons";

export default function LibraryLoading() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-3xl bg-white/[0.04] motion-reduce:animate-none" />
      <div className="h-20 animate-pulse rounded-3xl bg-white/[0.04] motion-reduce:animate-none" />
      <ListSkeleton />
    </div>
  );
}
