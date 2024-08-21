import { schemas } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  me: dashboardProcedure
    .output(schemas.user.userMeResponse)
    .query(({ ctx }) => {
      return ctx.user;
    }),
});
