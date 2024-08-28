import {
  guildMeRequestValidator,
  guildMeResponseValidator,
  guildsMeResponseValidator,
  joinGuildRequestValidator,
  leaveGuildRequestValidator,
} from "@giverve/validators";

import { services } from "../context";
import { botProcedure, createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardGuildsRouter = createTRPCRouter({
  getAll: dashboardProcedure
    .output(guildsMeResponseValidator)
    .query(async ({ ctx }) => {
      const guilds = await services.user.getManagedGuilds(
        BigInt(ctx.user.id),
        ctx.accessToken,
      );
      return guilds;
    }),

  getOne: dashboardProcedure
    .input(guildMeRequestValidator)
    .output(guildMeResponseValidator)
    .query(async ({ input }) => {
      const guild = await services.guild.getGuildWithPermissions(
        BigInt(input.guildId),
      );
      return guild;
    }),
});

export const botGuildsRouter = createTRPCRouter({
  join: botProcedure
    .input(joinGuildRequestValidator)
    .mutation(async ({ input }) => {
      return await services.user.joinGuild({
        ...input,
        guildId: BigInt(input.guildId),
        ownerId: BigInt(input.ownerId),
      });
    }),

  leave: botProcedure
    .input(leaveGuildRequestValidator)
    .mutation(async ({ input }) => {
      return await services.user.leaveGuild(BigInt(input.guildId));
    }),
});
