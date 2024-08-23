import { Skeleton } from "@giverve/ui/skeleton";

export default function GuildSkeletonCard() {
  return (
    <section className="flex animate-pulse flex-col">
      <div className="relative overflow-hidden">
        <Skeleton className="h-36 w-full"></Skeleton>
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full"></Skeleton>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2.5">
        <Skeleton className="h-6 w-32 rounded"></Skeleton>
        <Skeleton className="h-9 w-24 rounded px-3"></Skeleton>
      </div>
    </section>
  );
}
