import { useRouter } from "next/router";

import { trpc } from "~/utils/trpc";

export function useGetEvent(eventId?: string) {
  const router = useRouter();
  const guildId = String(router.query.guildId);
  return trpc.dashboard.event.getOne.useQuery(
    {
      eventId: eventId ?? String(router.query.eventId),
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry(failureCount, error) {
        if (error.data?.code === "NOT_FOUND") {
          void router.replace(`/dashboard/${guildId}/events`);
          return false;
        }
        if (error.data?.code === "FORBIDDEN") {
          void router.replace(`/dashboard/${guildId}/events`);
          return false;
        }
        return failureCount < 3;
      },
    },
  );
}
