import { z } from "zod";

export const botSaveGuildRequest = z.object({
  guildId: z.number(),
  ownerId: z.number(),
  name: z.string(),
  icon: z.string().nullable(),
});

export const botLeaveGuildRequest = z.object({
  guildId: z.number(),
});

export type BotSaveGuildRequest = z.infer<typeof botSaveGuildRequest>;
export type BotLeaveGuildRequest = z.infer<typeof botLeaveGuildRequest>;
