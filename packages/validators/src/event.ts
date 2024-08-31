import { z } from "zod";

export const createEventRequestValidator = z.object({
  guildId: z.string(),
  title: z.string().min(3).max(50),
  description: z.string().max(150),
});
export const createEventResponseValidator = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});
export type CreateEventResponse = z.infer<typeof createEventResponseValidator>;

export const getEventRequestValidator = z.object({
  eventId: z.string(),
});
export const getEventResponseValidator = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});
export type GetEventResponse = z.infer<typeof getEventResponseValidator>;

export const updateEventRequestValidator = z.object({
  eventId: z.string(),
  title: z.string().min(3).max(50),
  description: z.string().max(150).optional(),
});
export const updateEventResponseValidator = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});
export type UpdateEventResponse = z.infer<typeof updateEventResponseValidator>;
