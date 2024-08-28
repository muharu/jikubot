import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@giverve/api";

export const trpc = createTRPCReact<AppRouter>();
