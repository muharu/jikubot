import { z } from "zod";

export const eventSetupRequestValidator = z.object({
  channelId: z.string().min(1),
  title: z.string().min(3).max(50),
  description: z.string().max(150),
});
export type EventSetupRequest = z.infer<typeof eventSetupRequestValidator>;

export const eventInteraction = z.object({
  id: z.string(),
  name: z.string(),
  limit: z.number().int(),
});
export const eventInteractionsRequestValidator = z.array(eventInteraction);
export type EventInteraction = z.infer<typeof eventInteraction>;
export type EventInteractionsRequest = z.infer<
  typeof eventInteractionsRequestValidator
>;

export const createEventRequestValidator = z.object({
  eventSetup: eventSetupRequestValidator,
  eventInteractions: eventInteractionsRequestValidator,
});
export const createEventResponseValidator = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});
export type CreateEventRequest = z.infer<typeof createEventRequestValidator>;
export type CreateEventResponse = z.infer<typeof createEventResponseValidator>;
