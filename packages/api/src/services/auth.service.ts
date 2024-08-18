import { TRPCError } from "@trpc/server";

import type { RESTPostOAuth2AccessTokenResult } from "../common/lib/discord";
import { discord } from "../common/lib/discord";

export async function exchangeAuthorizationCodeForToken({
  code,
}: {
  code: string;
}): Promise<RESTPostOAuth2AccessTokenResult> {
  const fetch = discord.fetch;
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

export const authServices = {
  exchangeAuthorizationCodeForToken,
};
