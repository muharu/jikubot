import { useParams } from "next/navigation";

import { trpc } from "~/utils/trpc";

export function useGetEmojis() {
  const { guildId } = useParams<{ guildId: string }>();
  return trpc.dashboard.guilds.getEmojis.useQuery({
    guildId,
  });
}
