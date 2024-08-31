import { useEffect } from "react";
import { useRouter } from "next/router";

import { useGuildsListStore } from "~/state/guilds-list-store";
import { trpc } from "~/utils/trpc";

export function useGetGuilds() {
  const router = useRouter();

  const guilds = useGuildsListStore((state) => state.guilds);
  const setGuilds = useGuildsListStore((state) => state.setGuilds);

  const query = trpc.dashboard.guilds.getAll.useQuery(undefined, {
    retry(failureCount, error) {
      if (error.data?.code === "UNAUTHORIZED") {
        void router.replace("/login");
        return false;
      }
      return failureCount < 3;
    },
    initialData: guilds.length ? guilds : undefined,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setGuilds(query.data);
    }
  }, [query.data, query.isSuccess, setGuilds]);

  return query;
}
