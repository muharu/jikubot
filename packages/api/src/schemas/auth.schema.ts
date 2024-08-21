import { z } from "zod";

export const loginResponse = z.object({
  url: z.string(),
});

export const authorizeRequest = z.object({
  code: z.string(),
  state: z.string(),
});

export const authorizeResponse = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  globalName: z.string(),
  avatar: z.string(),
});
