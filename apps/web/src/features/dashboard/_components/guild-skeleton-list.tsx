import { GuildListWrapper } from "./guild-list-wrapper";
import { GuildSkeletonCard } from "./guild-skeleton-card";

export function GuildSkeletonList() {
  const skeletonCards = Array.from({ length: 12 });

  return (
    <GuildListWrapper>
      {skeletonCards.map((_, index) => (
        <GuildSkeletonCard key={index} />
      ))}
    </GuildListWrapper>
  );
}
