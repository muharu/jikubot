import { TRPCError } from "@trpc/server";

import {
  createEventRequestValidator,
  createEventResponseValidator,
  getEventRequestValidator,
  getEventResponseValidator,
  updateEventRequestValidator,
  updateEventResponseValidator,
} from "@giverve/validators";

import { services } from "../context";
import { createTRPCRouter, dashboardProcedure } from "../trpc";

export const dashboardEventRouter = createTRPCRouter({
  create: dashboardProcedure
    .input(createEventRequestValidator)
    .output(createEventResponseValidator)
    .mutation(async ({ input, ctx }) => {
      return await services.event.createEvent({
        guildId: BigInt(input.guildId),
        discordId: BigInt(ctx.user.id),
        title: input.title,
        description: input.description,
      });
    }),

  patch: dashboardProcedure
    .input(updateEventRequestValidator)
    .output(updateEventResponseValidator)
    .mutation(async ({ input, ctx }) => {
      return await services.event.updateEvent({
        eventId: BigInt(input.eventId),
        discordId: BigInt(ctx.user.id),
        title: input.title,
        description: input.description,
      });
    }),

  getOne: dashboardProcedure
    .input(getEventRequestValidator)
    .output(getEventResponseValidator)
    .query(async ({ ctx, input }) => {
      const event = await services.event.getEvent({
        discordId: BigInt(ctx.user.id),
        eventId: BigInt(input.eventId),
      });
      if (event.discordId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }
      return {
        eventId: event.eventId,
        title: event.title,
        description: event.description,
      };
    }),
});
