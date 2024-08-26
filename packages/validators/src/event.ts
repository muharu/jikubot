import { z } from "zod";

export const createEventRequestValidator = z.object({
  guildId: z.string(),
  title: z.string().min(3).max(50),
  description: z.string().max(150),
});

export const createEventResponseValidator = z.object({
  eventId: z.string(),
});
