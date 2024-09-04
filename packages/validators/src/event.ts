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
  id: z.string().min(1, {
    message: "Emoji cannot be empty.",
  }),
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  limit: z.string().refine((value) => !isNaN(Number(value)), {
    message: "Limit must be a numeric string.",
  }),
});
const uniqueIdsRefinement = z.array(eventInteraction).refine(
  (arr) => {
    const ids = arr.map((item) => item.id);
    return new Set(ids).size === ids.length;
  },
  {
    message: "Only one interaction per emoji is allowed.",
  },
);
export const eventInteractionsRequestValidator = uniqueIdsRefinement;
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
