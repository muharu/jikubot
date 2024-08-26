import { userMeResponseValidator } from "@giverve/validators";

import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardUserRouter = createTRPCRouter({
  me: dashboardProcedure.output(userMeResponseValidator).query(({ ctx }) => {
    return ctx.user;
  }),
});
