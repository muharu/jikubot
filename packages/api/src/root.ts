import { dashboardAuthRouter } from "./routers/auth.router";
import { dashboardEventRouter } from "./routers/event.router";
import { botUserRouter, dashboardUserRouter } from "./routers/user.router";
import { createTRPCRouter } from "./trpc";

const botRouter = createTRPCRouter({
  user: botUserRouter,
});

const dashboardRouter = createTRPCRouter({
  auth: dashboardAuthRouter,
  event: dashboardEventRouter,
  user: dashboardUserRouter,
});

export const appRouter = createTRPCRouter({
  bot: botRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
