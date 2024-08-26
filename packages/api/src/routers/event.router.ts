import { db, events } from "@giverve/db";
import {
  createEventRequestValidator,
  createEventResponseValidator,
} from "@giverve/validators";

import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardEventRouter = createTRPCRouter({
  create: dashboardProcedure
    .input(createEventRequestValidator)
    .output(createEventResponseValidator)
    .mutation(async ({ input, ctx }) => {
      const [event] = await db
        .insert(events)
        .values({
          guildId: BigInt(input.guildId),
          discordId: BigInt(ctx.user.id),
          title: input.title,
          description: input.description,
        })
        .returning({
          id: events.id,
        });

      return {
        eventId: String(event?.id),
      };
    }),
});
