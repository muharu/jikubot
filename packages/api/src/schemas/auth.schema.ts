import { z } from "zod";

export const authSchema = {
  loginResponse: z.object({
    url: z.string().url(),
  }),

  authorizeRequest: z.object({
    code: z.string(),
    state: z.string(),
  }),
};
