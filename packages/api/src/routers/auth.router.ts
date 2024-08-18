import API_CONSTANTS from "../common/constants";
import cookies from "../common/cookies";
import utils from "../common/utils";
import authSchema from "../schemas/auth.schema";
import authServices from "../services/auth.service";
import { createTRPCRouter, publicProcedure } from "../trpc";

const {
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_OAUTH_STATE_NAME,
} = API_CONSTANTS;

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .output(authSchema.loginResponse)
    .mutation(({ ctx }) => {
      const { res } = ctx;
      const authState = utils.generateRandomString(43);
      const url = utils.generateDiscordAuthorizationUrl(authState);
      cookies.setCookie(res, COOKIE_OAUTH_STATE_NAME, authState, {
        maxAge: 60 * 60, // 1 hour
      });
      return { url };
    }),

  authorize: publicProcedure
    .input(authSchema.authorizeRequest)
    .mutation(async ({ ctx, input }) => {
      const { res } = ctx;
      const { code } = input;

      const tokens = await authServices.exchangeAuthorizationCodeForToken(code);
      const encryptedAccessToken = utils.encryptString(tokens.access_token);
      const encryptedRefreshToken = utils.encryptString(tokens.refresh_token);

      cookies.setCookie(res, COOKIE_ACCESS_TOKEN_NAME, encryptedAccessToken, {
        maxAge: tokens.expires_in,
      });

      cookies.setCookie(res, COOKIE_REFRESH_TOKEN_NAME, encryptedRefreshToken, {
        maxAge: tokens.expires_in,
      });

      return {
        code: input.code,
        state: input.state,
      };
    }),
});
