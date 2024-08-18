import type { FetchLike, WretchOptions } from "wretch";
import { Routes } from "discord-api-types/v10";
import wretch from "wretch";

const DISCORD_API_VERSION = 10;
const DISCORD_API_BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;

const discordApiFetch = wretch(DISCORD_API_BASE_URL);

const discordRatelimitHandlerMiddleware =
  (next: FetchLike) => async (url: string, opts: WretchOptions) => {
    const response = await next(url, opts);

    if (response.status === 429) {
      const resetAfter = Number(
        response.headers.get("X-RateLimit-Reset-After"),
      );
      await new Promise((resolve) => setTimeout(resolve, resetAfter * 1000));
      return next(url, opts);
    }

    return response;
  };

discordApiFetch.middlewares([discordRatelimitHandlerMiddleware]);

export const discord = {
  fetch: discordApiFetch,
  routes: Routes,
};

export type * from "discord-api-types/v10";
