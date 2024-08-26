import {
  guildsMeResponseValidator,
  userMeResponseValidator,
} from "@giverve/validators";

import { services } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";
import { botGuildsRouter } from "./sub-routers/guild.router";

export const dashboardUserRouter = createTRPCRouter({
  me: dashboardProcedure.output(userMeResponseValidator).query(({ ctx }) => {
    return ctx.user;
  }),

  guilds: dashboardProcedure
    .output(guildsMeResponseValidator)
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
