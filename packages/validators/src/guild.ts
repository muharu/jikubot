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

export const guildMeRequestValidator = z.object({
  guildId: z.string(),
});

export const guildMeResponseValidator = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.string(),
  icon: z.string().nullable().optional(),
  isJoined: z.boolean(),
});
export const guildsMeResponseValidator = z.array(guildMeResponseValidator);

export type GuildMe = z.infer<typeof guildMeResponseValidator>;
export type GuildsMe = z.infer<typeof guildsMeResponseValidator>;
