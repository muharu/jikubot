import { useRouter } from "next/router";

import useAuth from "~/hooks/use-auth";
import useGetGuilds from "~/hooks/use-get-guilds";

export default function useDashboardCheck() {
  const router = useRouter();
  const { isLoading: isUserLoading } = useAuth();
  const { isLoading: isGuildsLoading, data: guilds } = useGetGuilds();

  const guildId = String(router.query.guildId);

  const isInGuilds = guilds?.some(
    (guild) => guild.id === guildId && guild.isJoined,
  );

  if (isUserLoading || isGuildsLoading) {
    return { isLoading: true, isInGuilds: false };
  }

  if (!isInGuilds) {
    void router.push("/dashboard");
    return { isLoading: true, isInGuilds: false };
  }

  return { isLoading: false, isInGuilds };
}
