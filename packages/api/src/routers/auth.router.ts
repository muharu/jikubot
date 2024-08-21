import { common, schemas, services } from "../context";
import { createTRPCRouter, dashboardProcedure, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .output(schemas.auth.loginResponse)
    .mutation(({ ctx }) => {
      const authState = common.utils.crypto.generateRandomString(43);
      const url =
        common.utils.discord.generateDiscordAuthorizationUrl(authState);

      common.utils.cookies.setCookie(
        ctx.res,
        common.constants.COOKIE_OAUTH_STATE_NAME,
        authState,
        { maxAge: 60 * 60 },
      );

      return { url };
    }),

  authorize: publicProcedure
    .input(schemas.auth.authorizeRequest)
    .output(schemas.auth.authorizeResponse)
    .mutation(async ({ ctx, input }) => {
      const tokens = await services.auth.exchangeAuthorizationCodeForToken(
        input.code,
      );

      const userInfoFromDiscord =
        await services.auth.exchangeAccessTokenForUserInfo(tokens.access_token);

      const user = {
        id: parseInt(userInfoFromDiscord.id),
        username: String(userInfoFromDiscord.username),
        email: String(userInfoFromDiscord.email),
        avatar: String(userInfoFromDiscord.avatar),
        globalName: String(userInfoFromDiscord.global_name),
      };

      const jwtExpirationTime = new Date(Date.now() + tokens.expires_in * 1000);

      const jwt = await common.utils.jwt.signJWT(user, jwtExpirationTime);

      const encryptedAccessToken = common.utils.crypto.encryptString(
        tokens.access_token,
      );
      const encryptedRefreshToken = common.utils.crypto.encryptString(
        tokens.refresh_token,
      );
      const encryptedJWT = common.utils.crypto.encryptString(jwt);

      await services.auth.saveOrUpdateUser(user.id, {
        discordId: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        globalName: user.globalName,
      });
      await services.auth.saveOrUpdateUserTokens(user.id, {
        discordId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      common.utils.cookies.setCookie(
        ctx.res,
        common.constants.COOKIE_ACCESS_TOKEN_NAME,
        encryptedAccessToken,
        { maxAge: tokens.expires_in },
      );
      common.utils.cookies.setCookie(
        ctx.res,
        common.constants.COOKIE_REFRESH_TOKEN_NAME,
        encryptedRefreshToken,
        { maxAge: tokens.expires_in },
      );
      common.utils.cookies.setCookie(
        ctx.res,
        common.constants.COOKIE_JWT_NAME,
        encryptedJWT,
        { maxAge: tokens.expires_in },
      );

      return user;
    }),

  logout: dashboardProcedure.mutation(({ ctx }) => {
    common.utils.cookies.deleteCookie(
      ctx.res,
      common.constants.COOKIE_OAUTH_STATE_NAME,
    );
    common.utils.cookies.deleteCookie(
      ctx.res,
      common.constants.COOKIE_ACCESS_TOKEN_NAME,
    );
    common.utils.cookies.deleteCookie(
      ctx.res,
      common.constants.COOKIE_REFRESH_TOKEN_NAME,
    );
    common.utils.cookies.deleteCookie(
      ctx.res,
      common.constants.COOKIE_JWT_NAME,
    );
    return null;
  }),
});
