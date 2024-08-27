import { z } from "zod";

export const createEventRequestValidator = z.object({
  guildId: z.string(),
  title: z
    .string({
      required_error: "Title is required.",
    })
    .min(1, {
      message: "Title is required.",
    })
    .max(50)
    .refine((value) => value.trim().length > 0, {
      message: "Title required",
    }),
  description: z.string().max(150).optional(),
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
  title: z
    .string({
      required_error: "Title is required.",
    })
    .min(1, {
      message: "Title is required.",
    })
    .max(50)
    .refine((value) => value.trim().length > 0, {
      message: "Title required",
    }),
  description: z.string().max(150).optional(),
});
export const patchEventResponseValidator = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});
