import { z } from "zod";

export const userMeResponseValidator = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().nullable().optional(),
  globalName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});

export const guildMeResponseValidator = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.string(),
  icon: z.string().nullable().optional(),
  isJoined: z.boolean(),
});
export const guildsMeResponseValidator = z.array(guildMeResponseValidator);
