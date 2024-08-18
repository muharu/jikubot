import { z } from "zod";

export const loginResponse = z.object({
  url: z.string().url(),
});

export const authorizeRequest = z.object({
  code: z.string(),
  state: z.string(),
});

const authSchema = {
  loginResponse,
  authorizeRequest,
};

export default authSchema;
