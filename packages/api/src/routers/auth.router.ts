import { cookies } from "../common/cookies";
import { utils } from "../common/utils";
import { authSchema } from "../schemas/auth.schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .output(authSchema.loginResponse)
    .mutation(async ({ ctx }) => {
      const { res } = ctx;
      const authState = utils.generateRandomString(43);
      const url = utils.generateDiscordAuthorizationUrl(authState);
      await utils.addDelay(500);
      cookies.setCookie(res, "jikubot_oauth_token", authState, {
        maxAge: 60 * 60, // 1 hour
      });
      return { url };
    }),
});
