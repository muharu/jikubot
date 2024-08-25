import { z } from "zod";

import { db, events } from "@giverve/db";

import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardEventRouter = createTRPCRouter({
  create: dashboardProcedure
    .input(
      z.object({
        title: z.string().min(3).max(50),
        description: z.string().max(150),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [event] = await db
        .insert(events)
        .values({
          title: input.title,
          description: input.description,
          discordId: ctx.user.id,
        })
        .returning({
          id: events.id,
        });
      return event?.id;
    }),
});
