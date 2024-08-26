import { dashboardAuthRouter } from "./routers/auth.router";
import { dashboardEventRouter } from "./routers/event.router";
import {
  botGuildsRouter,
  dashboardGuildsRouter,
} from "./routers/guilds.router";
import { dashboardUserRouter } from "./routers/user.router";
import { createTRPCRouter } from "./trpc";

const botRouter = createTRPCRouter({
  guilds: botGuildsRouter,
});

const dashboardRouter = createTRPCRouter({
  auth: dashboardAuthRouter,
  event: dashboardEventRouter,
  guilds: dashboardGuildsRouter,
  user: dashboardUserRouter,
});

export const appRouter = createTRPCRouter({
  bot: botRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
