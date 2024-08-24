import { common, repositories, schemas } from "../context";
import { botProcedure, createTRPCRouter } from "../trpc";

export const botRouter = createTRPCRouter({
  inserGuilds: botProcedure
    .input(schemas.bot.botSaveGuildRequest)
    .mutation(async ({ input }) => {
      await common.utils.transaction(async (trx) => {
        const guild = await repositories.guild.findGuildById(
          Number(input.guildId),
          trx,
        );

        if (!guild) {
          await repositories.guild.insertGuild(input, trx);
        }
      });
    }),
});
