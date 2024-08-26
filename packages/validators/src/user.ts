import { z } from "zod";

export const userMeResponse = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().nullable().optional(),
  globalName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

export const guildMeResponse = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.string(),
  icon: z.string().nullable().optional(),
  isJoined: z.boolean(),
});
export const guildsMeResponse = z.array(guildMeResponse);
