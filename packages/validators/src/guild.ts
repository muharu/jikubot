import { z } from "zod";

export const joinGuildRequestValidator = z.object({
  guildId: z.string(),
  ownerId: z.string(),
  name: z.string(),
  icon: z.string().nullable().optional(),
});

export const leaveGuildRequestValidator = z.object({
  guildId: z.string(),
});
