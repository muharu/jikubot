import { TRPCError } from "@trpc/server";

import type {
  RESTGetAPIUserResult,
  RESTPostOAuth2AccessTokenResult,
} from "../common/discord";
import discord from "../common/discord";

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
  } catch {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Error getting tokens from discord server",
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
  } catch {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Error getting user info from discord server",
    });
  }
}

const authServices = {
  exchangeAuthorizationCodeForToken,
  exchangeAccessTokenForUserInfo,
};

export default authServices;
