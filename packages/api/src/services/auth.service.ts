import { TRPCError } from "@trpc/server";

import type { tokens, users } from "@giverve/db";

import type {
  RESTGetAPIUserResult,
  RESTPostOAuth2AccessTokenResult,
} from "../common/discord";
import discord from "../common/discord";
import utils from "../common/utils";
import userRepository from "../repositories/user.repository";

class AuthService {
  private fetch = discord.fetch;
  private transaction = utils.createDbTransaction();

  private getClientCredentialsParams() {
    return new URLSearchParams({
      client_id: String(process.env.AUTH_DISCORD_ID),
      client_secret: String(process.env.AUTH_DISCORD_SECRET),
    });
  }

  public async exchangeAuthorizationCodeForToken(
    code: string,
  ): Promise<RESTPostOAuth2AccessTokenResult> {
    const route = discord.routes.oauth2TokenExchange();
    const params = this.getClientCredentialsParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", `${process.env.API_BASE_URL}/authorize`);

    try {
      return await this.fetch
        .url(route)
        .body(params)
        .post()
        .json<RESTPostOAuth2AccessTokenResult>();
    } catch (error) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Failed to exchange authorization code with Discord.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }

  public async exchangeAccessTokenForUserInfo(
    accessToken: string,
  ): Promise<RESTGetAPIUserResult> {
    const route = discord.routes.user();

    try {
      return await this.fetch
        .url(route)
        .headers({
          Authorization: `Bearer ${accessToken}`,
        })
        .get()
        .json<RESTGetAPIUserResult>();
    } catch (error) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Failed to fetch user info from Discord.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }

  public async getNewTokens(refreshToken: string) {
    const route = discord.routes.oauth2TokenExchange();
    const params = this.getClientCredentialsParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    try {
      return await this.fetch
        .url(route)
        .body(params)
        .post()
        .json<RESTPostOAuth2AccessTokenResult>();
    } catch (error) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Failed to refresh access token with Discord.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }

  public async revokeAccessToken(accessToken: string) {
    const route = discord.routes.oauth2TokenRevocation();
    const params = new URLSearchParams({
      token: accessToken,
      token_type_hint: "access_token",
    });

    try {
      return await this.fetch.url(route).body(params).post().json();
    } catch (error) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Failed to revoke token with Discord.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }

  public async revokeRefreshToken(refreshToken: string) {
    const route = discord.routes.oauth2TokenRevocation();
    const params = new URLSearchParams({
      token: refreshToken,
      token_type_hint: "refresh_token",
    });

    try {
      return await this.fetch.url(route).body(params).post().json();
    } catch (error) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Failed to revoke token with Discord.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }

  public async revokeAllTokens(accessToken: string, refreshToken: string) {
    try {
      await Promise.all([
        this.revokeAccessToken(accessToken),
        this.revokeRefreshToken(refreshToken),
      ]);
    } catch (error) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Failed to revoke all tokens with Discord.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }

  public async saveOrUpdateUser(
    discordId: number,
    data: typeof users.$inferInsert,
  ) {
    try {
      return await this.transaction(async (ctx) => {
        const user = await userRepository.findUserByDiscordId(discordId, ctx);
        if (!user) {
          await userRepository.insertUser(data, ctx);
        } else {
          await userRepository.updateUserByDiscordId(discordId, data, ctx);
        }
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save or update user in the database.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }

  public async saveOrUpdateUserTokens(
    discordId: number,
    data: typeof tokens.$inferInsert,
  ) {
    try {
      return await this.transaction(async (ctx) => {
        const user = await userRepository.findUserTokensByDiscordId(
          discordId,
          ctx,
        );
        if (!user) {
          await userRepository.insertUserTokens(data, ctx);
        } else {
          await userRepository.updateUserTokensByDiscordId(
            discordId,
            data,
            ctx,
          );
        }
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to save or update user tokens in the database.",
        cause: process.env.NODE_ENV !== "production" && error,
      });
    }
  }
}

export default new AuthService();
