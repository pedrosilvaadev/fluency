import { ListSkeleton } from "@/components/fluenty/content-skeletons";

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-3xl bg-white/[0.04] motion-reduce:animate-none" />
      <div className="h-28 animate-pulse rounded-3xl bg-white/[0.04] motion-reduce:animate-none" />
      <ListSkeleton items={3} />
    </div>
  );
}
