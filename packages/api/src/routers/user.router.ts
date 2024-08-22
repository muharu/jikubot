import { schemas, services } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: dashboardProcedure
    .output(schemas.user.userMeResponse)
    .query(({ ctx }) => {
      return ctx.user;
    }),

  guilds: dashboardProcedure.query(async ({ ctx }) => {
    const guilds = await services.user.getUserGuilds(ctx.accessToken);
    return guilds;
  }),
});
