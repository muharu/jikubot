import { schemas, services } from "../context";
import { botProcedure, createTRPCRouter } from "../trpc";

export const botRouter = createTRPCRouter({
  inserGuilds: botProcedure
    .input(schemas.bot.botSaveGuildRequest)
    .mutation(async ({ input }) => {
      await services.user.saveGuildOrUpdateActiveStatus(input);
    }),
});
