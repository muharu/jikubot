import type { FetchLike, WretchOptions } from "wretch";
import { Routes } from "discord-api-types/v10";
import wretch from "wretch";
import { WretchError } from "wretch/resolver";

const DISCORD_API_VERSION = 10;
const BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;

export function generateDiscordAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: String(process.env.AUTH_DISCORD_ID),
    redirect_uri: String(process.env.API_BASE_URL + "/authorize"),
    response_type: "code",
    scope: "identify email guilds",
    state,
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export const fetch = wretch(BASE_URL).middlewares([
  discordRatelimitHandlerMiddleware,
]);

export const routes = Routes;

function discordRatelimitHandlerMiddleware(next: FetchLike) {
  return async function (url: string, opts: WretchOptions) {
    let response = await next(url, opts);
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after"));
      if (!isNaN(retryAfter)) {
        await new Promise(function (resolve) {
          setTimeout(resolve, retryAfter * 1000);
        });
        response = await next(url, opts);
      } else {
        throw new WretchError(
          "Rate limit exceeded without a Retry-After header.",
        );
      }
    }
    return response;
  };
}
