import { useRouter } from "next/router";

import { trpc } from "~/utils/trpc";

export default function useGetGuilds() {
  const router = useRouter();
  return trpc.dashboard.guilds.getAll.useQuery(undefined, {
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
