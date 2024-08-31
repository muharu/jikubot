import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { useGuildsListStore } from "~/state/guilds-list-store";
import { trpc } from "~/utils/trpc";

export function useGetGuilds() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const guildId = searchParams.get("guild_id");
  const permissions = searchParams.get("permissions");

  const gotQueryParams = code ?? guildId ?? permissions;

  const { guilds, setGuilds } = useGuildsListStore((state) => ({
    guilds: state.guilds,
    setGuilds: state.setGuilds,
  }));

  const query = trpc.dashboard.guilds.getAll.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        void router.replace("/login");
        return false;
      }
      return failureCount < 3;
    },
    initialData: guilds.length && !gotQueryParams ? guilds : undefined,
  });

  useEffect(() => {
    if (gotQueryParams) {
      void router.replace(router.pathname, undefined, { shallow: true });
    }

    if (query.isSuccess) {
      setGuilds(query.data);
    }
  }, [gotQueryParams, query.isSuccess, query.data, router, setGuilds]);

  return query;
}
