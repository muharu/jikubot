import type {
  RESTGetAPIUserResult,
  RESTPostOAuth2AccessTokenResult,
} from "discord-api-types/v10";
import { TRPCError } from "@trpc/server";

import type { InsertTokens } from "../repositories/token.repository";
import type { InsertUser } from "../repositories/user.repository";
import common from "../common/common.module";
import repositories from "../repositories/repostiories.module";

export async function exchangeAuthorizationCodeForToken(
  code: string,
): Promise<RESTPostOAuth2AccessTokenResult> {
  const route = common.discord.routes.oauth2TokenExchange();
  const params = getClientCredentialsParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", `${process.env.API_BASE_URL}/authorize`);

  try {
    return await common.discord.fetch
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
  const route = common.discord.routes.user();

  try {
    return await common.discord.fetch
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
  const route = common.discord.routes.oauth2TokenExchange();
  const params = getClientCredentialsParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  try {
    return await common.discord.fetch
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
  const route = common.discord.routes.oauth2TokenRevocation();
  const params = new URLSearchParams({
    token: accessToken,
    token_type_hint: "access_token",
  });

  try {
    return await common.discord.fetch.url(route).body(params).post().json();
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Failed to revoke token with Discord.",
      cause: process.env.NODE_ENV !== "production" && error,
    });
  }
}

export async function revokeRefreshToken(refreshToken: string) {
  const route = common.discord.routes.oauth2TokenRevocation();
  const params = new URLSearchParams({
    token: refreshToken,
    token_type_hint: "refresh_token",
  });

  try {
    return await common.discord.fetch.url(route).body(params).post().json();
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

export async function saveOrUpdateUser(discordId: number, data: InsertUser) {
  try {
    return await common.transaction(async function (trx) {
      const user = await repositories.user.findUserByDiscordId(discordId, trx);
      if (!user) {
        await repositories.user.insertUser(data, trx);
      } else {
        await repositories.user.updateUserByDiscordId(discordId, data, trx);
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
  data: InsertTokens,
) {
  try {
    return await common.transaction(async function (trx) {
      const user = await repositories.token.findUserTokensByDiscordId(
        discordId,
        trx,
      );
      if (!user) {
        await repositories.token.insertUserTokens(data, trx);
      } else {
        await repositories.token.updateUserTokensByDiscordId(
          discordId,
          data,
          trx,
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

function getClientCredentialsParams() {
  return new URLSearchParams({
    client_id: String(process.env.AUTH_DISCORD_ID),
    client_secret: String(process.env.AUTH_DISCORD_SECRET),
  });
}
