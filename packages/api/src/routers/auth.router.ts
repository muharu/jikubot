import discord from "../common/discord";
import authSchema from "../schemas/auth.schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .output(authSchema.loginResponse)
    .mutation(({ ctx: { res, common } }) => {
      // Generate a random state and Discord authorization URL
      const authState = common.utils.generateRandomString(43);
      const url = discord.generateDiscordAuthorizationUrl(authState);

      // Set OAuth state cookie with 1-hour expiration
      common.cookies.setCookie(
        res,
        common.constants.COOKIE_OAUTH_STATE_NAME,
        authState,
        { maxAge: 60 * 60 }, // 1 hour
      );

      return { url };
    }),

  authorize: publicProcedure
    .input(authSchema.authorizeRequest)
    .output(authSchema.authorizeResponse)
    .mutation(async ({ ctx: { res, common, services }, input: { code } }) => {
      // Exchange authorization code for tokens
      const { access_token, refresh_token, expires_in } =
        await services.auth.exchangeAuthorizationCodeForToken(code);

      // Get user info from Discord
      const userInfoFromDiscord =
        await services.auth.exchangeAccessTokenForUserInfo(access_token);

      // Convert Discord user info to our user object
      const user = {
        id: parseInt(userInfoFromDiscord.id),
        username: String(userInfoFromDiscord.username),
        email: String(userInfoFromDiscord.email),
        avatar: String(userInfoFromDiscord.avatar),
        globalName: String(userInfoFromDiscord.global_name),
      };

      // Calculate JWT expiration time
      const jwtExpirationTime = new Date(Date.now() + expires_in * 1000);

      // Sign the JWT
      const jwt = await common.utils.signJWT(user, jwtExpirationTime);

      // Encrypt tokens and JWT
      const encryptedAccessToken = common.utils.encryptString(access_token);
      const encryptedRefreshToken = common.utils.encryptString(refresh_token);
      const encryptedJWT = common.utils.encryptString(jwt);

      // Save or update user and tokens
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

      // Set cookies for access token, refresh token, and JWT
      common.cookies.setCookie(
        res,
        common.constants.COOKIE_ACCESS_TOKEN_NAME,
        encryptedAccessToken,
        { maxAge: expires_in },
      );

      common.cookies.setCookie(
        res,
        common.constants.COOKIE_REFRESH_TOKEN_NAME,
        encryptedRefreshToken,
        { maxAge: expires_in },
      );

      common.cookies.setCookie(
        res,
        common.constants.COOKIE_JWT_NAME,
        encryptedJWT,
        { maxAge: expires_in },
      );

      return user;
    }),
});
