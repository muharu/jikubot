import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@giverve/api";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.API_BASE_URL}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
