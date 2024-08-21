import { z } from "zod";

export const userMeResponse = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  globalName: z.string(),
  avatar: z.string(),
});
