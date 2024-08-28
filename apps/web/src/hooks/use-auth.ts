import { useRouter } from "next/router";

import type { User } from "~/utils/types";
import { trpc } from "~/utils/trpc";

export default function useAuth(initialData?: User) {
  const router = useRouter();
  return trpc.dashboard.user.me.useQuery(undefined, {
    initialData,
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
