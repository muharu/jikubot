import { useRouter } from "next/router";

import { api } from "~/utils/api";

export default function useGetGuilds() {
  const router = useRouter();
  return api.dashboard.user.guilds.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry(failureCount, error) {
      if (error.data?.code === "UNAUTHORIZED") {
        void router.replace("/login");
        return false;
      }
      return failureCount < 3;
    },
  });
}
