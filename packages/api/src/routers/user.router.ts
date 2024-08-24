import { schemas, services } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: dashboardProcedure
    .output(schemas.user.userMeResponse)
    .query(({ ctx }) => {
      return ctx.user;
    }),

  guilds: dashboardProcedure
    .output(schemas.user.guildsMeResponse)
    .query(async ({ ctx }) => {
      const guilds = await services.user.getManagedGuilds(
        ctx.user.id,
        ctx.accessToken,
      );
      return guilds;
    }),
});
