import { common, repositories, schemas, services } from "../context";
import { botProcedure, createTRPCRouter, dashboardProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: dashboardProcedure
    .output(schemas.user.userMeResponse)
    .query(({ ctx }) => {
      return ctx.user;
    }),

  guilds: dashboardProcedure
    .output(schemas.user.guildsMeResponse)
    .query(async ({ ctx }) => {
      const guilds = await services.user.getManagedGuilds(ctx.accessToken);
      return guilds;
    }),

  botAddGuild: botProcedure
    .input(schemas.user.guildMeRequest)
    .mutation(async ({ input }) => {
      await common.utils.transaction(async (trx) => {
        const guild = await repositories.guild.findGuildById(
          Number(input.id),
          trx,
        );

        if (!guild) {
          await repositories.guild.insertGuild(
            { guildId: Number(input.id) },
            trx,
          );
        }
      });
    }),
});
