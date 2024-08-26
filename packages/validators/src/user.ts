import { z } from "zod";

export const userMeResponseValidator = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().nullable().optional(),
  globalName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});
