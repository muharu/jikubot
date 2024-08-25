import { z } from "zod";

import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardEventRouter = createTRPCRouter({
  create: dashboardProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(({ input }) => {
      console.log(input);
      return input;
    }),
});
