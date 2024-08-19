import type { FetchLike, WretchOptions } from "wretch";
import wretch from "wretch";
import { WretchError } from "wretch/resolver";

const DISCORD_API_VERSION = 10;
const DISCORD_API_BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;

const discordApiFetchInstance = wretch(DISCORD_API_BASE_URL);

const discordRatelimitHandlerMiddleware =
  (next: FetchLike) => async (url: string, opts: WretchOptions) => {
    let response = await next(url, opts);

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("retry-after"));
      if (!isNaN(retryAfter)) {
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        response = await next(url, opts);
      } else {
        throw new WretchError(
          "Rate limit exceeded without a Retry-After header.",
        );
      }
    }

    return response;
  };

discordApiFetchInstance.middlewares([discordRatelimitHandlerMiddleware]);

export { discordApiFetchInstance };
