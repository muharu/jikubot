import { db, events } from "@giverve/db";

import { schemas } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardEventRouter = createTRPCRouter({
  create: dashboardProcedure
    .input(schemas.event.eventCreateRequest)
    .output(schemas.event.eventCreateResponse)
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
