import { cookies } from "../common/cookies";
import { utils } from "../common/utils";
import { authSchema } from "../schemas/auth.schema";
import { authServices } from "../services/auth.service";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .output(authSchema.loginResponse)
    .mutation(({ ctx }) => {
      const { res } = ctx;
      const authState = utils.generateRandomString(43);
      const url = utils.generateDiscordAuthorizationUrl(authState);
      cookies.setCookie(res, "jikubot_oauth_token", authState, {
        maxAge: 60 * 60, // 1 hour
      });
      return { url };
    }),

  authorize: publicProcedure
    .input(authSchema.authorizeRequest)
    .mutation(async ({ input }) => {
      const tokens = await authServices.exchangeAuthorizationCodeForToken({
        code: input.code,
      });

      console.log(tokens);

      return {
        code: input.code,
        state: input.state,
      };
    }),
});
