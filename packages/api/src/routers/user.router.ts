import { schemas, services } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";
import { botGuildsRouter } from "./sub-routers/guild.router";

export const dashboardUserRouter = createTRPCRouter({
  me: dashboardProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  guilds: dashboardProcedure
    .output(schemas.user.guildsMeResponse)
    .query(async ({ ctx }) => {
      const guilds = await services.user.getManagedGuilds(
        BigInt(ctx.user.id),
        ctx.accessToken,
      );
      return guilds;
    }),
});

export const botUserRouter = createTRPCRouter({
  guilds: botGuildsRouter,
});
