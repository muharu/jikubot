import { schemas, services } from "../../context";
import { botProcedure, createTRPCRouter } from "../../trpc";

export const botGuildsRouter = createTRPCRouter({
  join: botProcedure
    .input(schemas.bot.botSaveGuildRequest)
    .mutation(async ({ input }) => {
      return await services.user.joinGuild(input);
    }),

  leave: botProcedure
    .input(schemas.bot.botLeaveGuildRequest)
    .mutation(async ({ input }) => {
      return await services.user.leaveGuild(input.guildId);
    }),
});
