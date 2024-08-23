import useGetGuilds from "~/hooks/use-get-guilds";
import GuildCard from "./guild-card";
import GuildListWrapper from "./guild-list-wrapper";
import GuildSkeletonList from "./guild-skeleton-list";

export default function GuildList() {
  const { data: guilds, isLoading } = useGetGuilds();

  if (isLoading) return <GuildSkeletonList />;

  return (
    <GuildListWrapper>
      {guilds?.map(({ id, name, icon, isJoined }) => (
        <GuildCard
          key={id}
          id={id}
          name={name}
          icon={icon}
          isJoined={isJoined}
        />
      ))}
    </GuildListWrapper>
  );
}
