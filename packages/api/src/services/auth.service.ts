import { TRPCError } from "@trpc/server";

import type { tokens, users } from "@giverve/db";

import type {
  RESTGetAPIUserResult,
  RESTPostOAuth2AccessTokenResult,
} from "../common/discord";
import discord from "../common/discord";
import utils from "../common/utils";
import userRepository from "../repositories/user.repository";

const fetch = discord.fetch;
const transaction = utils.createDbTransaction();

export async function exchangeAuthorizationCodeForToken(
  code: string,
): Promise<RESTPostOAuth2AccessTokenResult> {
  const route = discord.routes.oauth2TokenExchange();
  const params = new URLSearchParams();

  params.append("client_id", String(process.env.AUTH_DISCORD_ID));
  params.append("client_secret", String(process.env.AUTH_DISCORD_SECRET));
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", `${process.env.API_BASE_URL}/authorize`);

  try {
    return await fetch
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

export async function exchangeAccessTokenForUserInfo(
  accessToken: string,
): Promise<RESTGetAPIUserResult> {
  const route = discord.routes.user();

  try {
    return await fetch
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

export async function getNewTokens(refreshToken: string) {
  const route = discord.routes.oauth2TokenExchange();
  const params = new URLSearchParams();

  params.append("client_id", String(process.env.AUTH_DISCORD_ID));
  params.append("client_secret", String(process.env.AUTH_DISCORD_SECRET));
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  try {
    return await fetch
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

export async function revokeAccessToken(accessToken: string) {
  const route = discord.routes.oauth2TokenRevocation();
  const params = new URLSearchParams();

  params.append("token", accessToken);
  params.append("token_type_hint", "access_token");

  try {
    return await fetch.url(route).body(params).post().json();
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Failed to revoke token with Discord.",
      cause: process.env.NODE_ENV !== "production" && error,
    });
  }
}

export async function revokeRefreshToken(refreshToken: string) {
  const route = discord.routes.oauth2TokenRevocation();
  const params = new URLSearchParams();

  params.append("token", refreshToken);
  params.append("token_type_hint", "refresh_token");

  try {
    return await fetch.url(route).body(params).post().json();
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Failed to revoke token with Discord.",
      cause: process.env.NODE_ENV !== "production" && error,
    });
  }
}

export async function revokeAllTokens(
  accessToken: string,
  refreshToken: string,
) {
  try {
    await Promise.all([
      revokeAccessToken(accessToken),
      revokeRefreshToken(refreshToken),
    ]);
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Failed to revoke all tokens with Discord.",
      cause: process.env.NODE_ENV !== "production" && error,
    });
  }
}

export async function saveOrUpdateUser(
  discordId: number,
  data: typeof users.$inferInsert,
) {
  try {
    return await transaction(async (ctx) => {
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

export async function saveOrUpdateUserTokens(
  discordId: number,
  data: typeof tokens.$inferInsert,
) {
  try {
    return await transaction(async (ctx) => {
      const user = await userRepository.findUserTokensByDiscordId(
        discordId,
        ctx,
      );
      if (!user) {
        await userRepository.insertUserTokens(data, ctx);
      } else {
        await userRepository.updateUserTokensByDiscordId(discordId, data, ctx);
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

const authServices = {
  exchangeAuthorizationCodeForToken,
  exchangeAccessTokenForUserInfo,
  getNewTokens,
  revokeAccessToken,
  revokeRefreshToken,
  revokeAllTokens,
  saveOrUpdateUser,
  saveOrUpdateUserTokens,
};

export default authServices;
