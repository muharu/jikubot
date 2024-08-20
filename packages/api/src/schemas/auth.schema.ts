import { z } from "zod";

class AuthSchema {
  public loginResponse = z.object({
    url: z.string().url(),
  });

  public authorizeRequest = z.object({
    code: z.string(),
    state: z.string(),
  });

  public authorizeResponse = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
    globalName: z.string(),
    avatar: z.string(),
  });
}

export default new AuthSchema();
