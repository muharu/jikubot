import { schemas, services } from "../context";
import { botProcedure, createTRPCRouter } from "../trpc";

export const botRouter = createTRPCRouter({
  guilds: {
    add: botProcedure
      .input(schemas.bot.botSaveGuildRequest)
      .mutation(async ({ input }) => {
        return await services.user.saveGuildOrUpdateActiveStatus(input);
      }),

    leave: botProcedure
      .input(schemas.bot.botLeaveGuildRequest)
      .mutation(async ({ input }) => {
        return await services.user.leaveGuild(input.guildId);
      }),
  },
});
