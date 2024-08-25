import { schemas, services } from "../../context";
import { botProcedure, createTRPCRouter } from "../../trpc";

export const botGuildsRouter = createTRPCRouter({
  add: botProcedure
    .input(schemas.bot.botSaveGuildRequest)
    .mutation(async ({ input }) => {
      return await services.user.joinGuild(input);
    }),

  leave: botProcedure
    .input(schemas.bot.botSaveGuildRequest)
    .mutation(async ({ input }) => {
      return await services.user.leaveGuild(input);
    }),
});
