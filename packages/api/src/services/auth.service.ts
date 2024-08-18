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
      ...(process.env.NODE_ENV !== "production" && { cause: error }),
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
      ...(process.env.NODE_ENV !== "production" && { cause: error }),
    });
  }
}

export async function saveOrUpdateUser(
  discordId: number,
  data: typeof users.$inferInsert,
) {
  try {
    return await utils.createDbTransaction(async (ctx) => {
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
      ...(process.env.NODE_ENV !== "production" && { cause: error }),
    });
  }
}

export async function saveOrUpdateUserTokens(
  discordId: number,
  data: typeof tokens.$inferInsert,
) {
  try {
    return await utils.createDbTransaction(async (ctx) => {
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
      ...(process.env.NODE_ENV !== "production" && { cause: error }),
    });
  }
}

const authServices = {
  exchangeAuthorizationCodeForToken,
  exchangeAccessTokenForUserInfo,
  saveOrUpdateUser,
  saveOrUpdateUserTokens,
};

export default authServices;
