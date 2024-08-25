import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@giverve/api";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.API_BASE_URL}/api/trpc`,
      transformer: superjson,
      headers: {
        Authorization: `Bearer ${process.env.BOT_DISCORD_TOKEN}`,
      },
    }),
  ],
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
