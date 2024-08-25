import { dashboardAuthRouter } from "./routers/auth.router";
import { botUserRouter, dashboardUserRouter } from "./routers/user.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  bot: {
    user: botUserRouter,
  },
  dashboard: {
    auth: dashboardAuthRouter,
    user: dashboardUserRouter,
  },
});

export type AppRouter = typeof appRouter;
