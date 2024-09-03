import { createEventRequestValidator } from "@giverve/validators";

import { services } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardEventRouter = createTRPCRouter({
  createOne: dashboardProcedure
    .input(createEventRequestValidator)
    .mutation(async ({ input }) => {
      return await services.event.sendEventMessage(input);
    }),
});
