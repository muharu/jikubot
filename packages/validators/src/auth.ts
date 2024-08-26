import { z } from "zod";

export const loginResponseValidator = z.object({
  url: z.string().url(),
});

export const authorizeRequestValidator = z.object({
  code: z.string(),
  state: z.string(),
});

export const authorizeResponseValidator = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().nullable().optional(),
  globalName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
});
