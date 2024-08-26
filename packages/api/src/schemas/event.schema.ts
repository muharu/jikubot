import { z } from "zod";

export const eventCreateRequest = z.object({
  guildId: z.string(),
  title: z.string().min(3).max(50),
  description: z.string().max(150),
});

export const eventCreateResponse = z.object({
  eventId: z.string(),
});
