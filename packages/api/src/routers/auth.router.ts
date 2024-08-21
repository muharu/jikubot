import schemas from "../schemas/schemas.module";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .output(schemas.auth.loginResponse)
    .mutation(({ ctx }) => {
      const authState = ctx.common.crypto.generateRandomString(43);
      const url = ctx.common.discord.generateDiscordAuthorizationUrl(authState);

      ctx.common.cookies.setCookie(
        ctx.res,
        ctx.common.constants.COOKIE_OAUTH_STATE_NAME,
        authState,
        { maxAge: 60 * 60 },
      );

      return { url };
    }),

  authorize: publicProcedure
    .input(schemas.auth.authorizeRequest)
    .output(schemas.auth.authorizeResponse)
    .mutation(async ({ ctx, input }) => {
      const tokens = await ctx.services.auth.exchangeAuthorizationCodeForToken(
        input.code,
      );

      const userInfoFromDiscord =
        await ctx.services.auth.exchangeAccessTokenForUserInfo(
          tokens.access_token,
        );

      const user = {
        id: parseInt(userInfoFromDiscord.id),
        username: String(userInfoFromDiscord.username),
        email: String(userInfoFromDiscord.email),
        avatar: String(userInfoFromDiscord.avatar),
        globalName: String(userInfoFromDiscord.global_name),
      };

      const jwtExpirationTime = new Date(Date.now() + tokens.expires_in * 1000);

      const jwt = await ctx.common.jwt.signJWT(user, jwtExpirationTime);

      const encryptedAccessToken = ctx.common.crypto.encryptString(
        tokens.access_token,
      );
      const encryptedRefreshToken = ctx.common.crypto.encryptString(
        tokens.refresh_token,
      );
      const encryptedJWT = ctx.common.crypto.encryptString(jwt);

      await ctx.services.auth.saveOrUpdateUser(user.id, {
        discordId: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        globalName: user.globalName,
      });
      await ctx.services.auth.saveOrUpdateUserTokens(user.id, {
        discordId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      ctx.common.cookies.setCookie(
        ctx.res,
        ctx.common.constants.COOKIE_ACCESS_TOKEN_NAME,
        encryptedAccessToken,
        { maxAge: tokens.expires_in },
      );
      ctx.common.cookies.setCookie(
        ctx.res,
        ctx.common.constants.COOKIE_REFRESH_TOKEN_NAME,
        encryptedRefreshToken,
        { maxAge: tokens.expires_in },
      );
      ctx.common.cookies.setCookie(
        ctx.res,
        ctx.common.constants.COOKIE_JWT_NAME,
        encryptedJWT,
        { maxAge: tokens.expires_in },
      );

      return user;
    }),
});
