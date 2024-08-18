import constants from "../common/constants";
import cookies from "../common/cookies";
import utils from "../common/utils";
import authUserDTOMapper from "../dtos/auth.dto";
import authSchema from "../schemas/auth.schema";
import authServices from "../services/auth.service";
import { createTRPCRouter, publicProcedure } from "../trpc";

const {
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  COOKIE_OAUTH_STATE_NAME,
  COOKIE_JWT_NAME,
} = constants;

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
    .output(authSchema.authorizeResponse)
    .mutation(async ({ ctx, input }) => {
      const { res } = ctx;
      const { code } = input;

      const { access_token, refresh_token, expires_in } =
        await authServices.exchangeAuthorizationCodeForToken(code);
      const userInfoFromDiscord =
        await authServices.exchangeAccessTokenForUserInfo(access_token);

      const user = authUserDTOMapper.convertToAuthUserDTO(userInfoFromDiscord);

      const jwt = await utils.signJWT(user, expires_in);

      const encryptedAccessToken = utils.encryptString(access_token);
      const encryptedRefreshToken = utils.encryptString(refresh_token);
      const encryptedJWT = utils.encryptString(jwt);

      await authServices.saveOrUpdateUser(user.id, {
        discordId: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        globalName: user.globalName,
      });

      await authServices.saveOrUpdateUserTokens(user.id, {
        discordId: user.id,
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      cookies.setCookie(res, COOKIE_ACCESS_TOKEN_NAME, encryptedAccessToken, {
        maxAge: expires_in,
      });
      cookies.setCookie(res, COOKIE_REFRESH_TOKEN_NAME, encryptedRefreshToken, {
        maxAge: expires_in,
      });
      cookies.setCookie(res, COOKIE_JWT_NAME, encryptedJWT, {
        maxAge: expires_in,
      });

      return user;
    }),
});
