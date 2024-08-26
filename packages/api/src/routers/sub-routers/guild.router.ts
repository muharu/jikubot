import {
  joinGuildRequestValidator,
  leaveGuildRequestValidator,
} from "@giverve/validators";

import { services } from "../../context";
import { botProcedure, createTRPCRouter } from "../../trpc";

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
