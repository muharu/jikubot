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

export const getEventRequestValidator = z.object({
  eventId: z.string(),
});
export const getEventResponseValidator = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});

export const patchEventRequestValidator = z.object({
  eventId: z.string(),
  title: z.string().min(3).max(50).optional(),
  description: z.string().max(150).optional(),
});
export const patchEventResponseValidator = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});
