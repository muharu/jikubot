import { z } from "zod";

export const botSaveGuildRequest = z.object({
  guildId: z.number(),
  ownerId: z.number(),
  name: z.string(),
  icon: z.string().nullable(),
});

export type BotSaveGuildRequest = z.infer<typeof botSaveGuildRequest>;
