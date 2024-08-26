import { TRPCError } from "@trpc/server";

import { db, events } from "@giverve/db";
import {
  createEventRequestValidator,
  createEventResponseValidator,
  getEventRequestValidator,
  getEventResponseValidator,
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
          title: events.title,
          description: events.description,
        });

      return {
        eventId: String(event?.id),
        title: String(event?.title),
        description: String(event?.description),
      };
    }),

  getOne: dashboardProcedure
    .input(getEventRequestValidator)
    .output(getEventResponseValidator)
    .query(async ({ ctx, input }) => {
      const event = await db.query.events.findFirst({
        where: (events, { eq }) => eq(events.id, BigInt(input.eventId)),
        columns: {
          id: true,
          discordId: true,
          title: true,
          description: true,
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (event.discordId !== BigInt(ctx.user.id)) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return {
        eventId: String(event.id),
        title: String(event.title),
        description: String(event.description),
      };
    }),
});
