import { z } from "zod";

export const userMeResponse = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  globalName: z.string(),
  avatar: z.string(),
});

export const guildMeResponse = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.string(),
  icon: z.string().nullable(),
  isJoined: z.boolean(),
});
export const guildsMeResponse = z.array(guildMeResponse);

export type UserMe = z.infer<typeof userMeResponse>;
export type GuildMe = z.infer<typeof guildMeResponse>;
export type GuildsMe = z.infer<typeof guildsMeResponse>;
