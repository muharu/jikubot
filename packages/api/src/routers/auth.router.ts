import discord from "../common/discord";
import authUserDTOMapper from "../dtos/auth.dto";
import authSchema from "../schemas/auth.schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .output(authSchema.loginResponse)
    .mutation(({ ctx }) => {
      const { res, common } = ctx;

      const authState = common.utils.generateRandomString(43);
      const url = discord.generateDiscordAuthorizationUrl(authState);

      common.cookies.setCookie(
        res,
        common.constants.COOKIE_OAUTH_STATE_NAME,
        authState,
        {
          maxAge: 60 * 60, // 1 hour
        },
      );

      return { url };
    }),

  authorize: publicProcedure
    .input(authSchema.authorizeRequest)
    .output(authSchema.authorizeResponse)
    .mutation(async ({ ctx, input }) => {
      const { code } = input;
      const { res, common, services } = ctx;

      const { access_token, refresh_token, expires_in } =
        await services.auth.exchangeAuthorizationCodeForToken(code);
      const userInfoFromDiscord =
        await services.auth.exchangeAccessTokenForUserInfo(access_token);

      const user = authUserDTOMapper.convertToAuthUserDTO(userInfoFromDiscord);
      const jwtExpirationTime = new Date(Date.now() + expires_in * 1000);

      const jwt = await common.utils.signJWT(user, jwtExpirationTime);

      const encryptedAccessToken = common.utils.encryptString(access_token);
      const encryptedRefreshToken = common.utils.encryptString(refresh_token);
      const encryptedJWT = common.utils.encryptString(jwt);

      await services.auth.saveOrUpdateUser(user.id, {
        discordId: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        globalName: user.globalName,
      });

      await services.auth.saveOrUpdateUserTokens(user.id, {
        discordId: user.id,
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      common.cookies.setCookie(
        res,
        common.constants.COOKIE_ACCESS_TOKEN_NAME,
        encryptedAccessToken,
        {
          maxAge: expires_in,
        },
      );
      common.cookies.setCookie(
        res,
        common.constants.COOKIE_REFRESH_TOKEN_NAME,
        encryptedRefreshToken,
        {
          maxAge: expires_in,
        },
      );
      common.cookies.setCookie(
        res,
        common.constants.COOKIE_JWT_NAME,
        encryptedJWT,
        {
          maxAge: expires_in,
        },
      );

      return user;
    }),
});
