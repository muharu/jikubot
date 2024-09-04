import { z } from "zod";

export const eventSetupRequestValidator = z.object({
  channelId: z.string({ required_error: "Please select a channel." }).min(1, {
    message: "Channel cannot be empty.",
  }),
  title: z
    .string({
      required_error: "A title is required.",
    })
    .min(1, {
      message: "Title cannot be empty.",
    })
    .max(50, {
      message: "Title must be under 50 characters.",
    }),
  description: z.string().max(150, {
    message: "Description must be under 150 characters.",
  }),
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
