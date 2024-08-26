import { z } from "zod";

export const botSaveGuildRequest = z.object({
  guildId: z.string(),
  ownerId: z.string(),
  name: z.string(),
  icon: z.string().nullable().optional(),
});

export const botLeaveGuildRequest = z.object({
  guildId: z.string(),
});
