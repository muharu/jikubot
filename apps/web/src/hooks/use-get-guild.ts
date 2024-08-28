import { useRouter } from "next/router";

import { trpc } from "~/utils/trpc";

export default function useGetGuild() {
  const router = useRouter();
  const guildId = router.query.guildId as string | undefined;

  return trpc.dashboard.guilds.getOne.useQuery(
    { guildId: guildId ?? "" },
    {
      retry(failureCount, error) {
        if (error.data?.code === "FORBIDDEN") {
          void router.push("/dashboard");
          return false;
        }
        return failureCount <= 3;
      },
      enabled: !!guildId,
      staleTime: 60 * 1000 * 5, // 5 minutes
    },
  );
}
