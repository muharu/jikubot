import { Skeleton } from "@giverve/ui/skeleton";

export function GuildSkeletonCard() {
  return (
    <section className="flex animate-pulse flex-col">
      <div className="relative overflow-hidden">
        <Skeleton className="h-36 w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 animate-pulse rounded-full border-2 border-border bg-white dark:border-darkBorder dark:bg-darkBg" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2.5">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24 px-3" />
      </div>
    </section>
  );
}
