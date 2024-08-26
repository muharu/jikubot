import { z } from "zod";

export const loginResponse = z.object({
  url: z.string(),
});

export const authorizeRequest = z.object({
  code: z.string(),
  state: z.string(),
});

export const authorizeResponse = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().nullable(),
  globalName: z.string().nullable(),
  avatar: z.string().nullable(),
});
