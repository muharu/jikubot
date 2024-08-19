import type { FetchLike, Wretch, WretchOptions } from "wretch";
import { Routes } from "discord-api-types/v10";
import wrapFetch from "wretch";
import { WretchError } from "wretch/resolver";

class Discord {
  public fetch: Wretch;
  public routes = Routes;

  constructor(apiVersion = 10) {
    const baseUrl = `https://discord.com/api/v${apiVersion}`;
    this.fetch = this.createFetchInstance(baseUrl);
  }

  private createFetchInstance(baseUrl: string): Wretch {
    const fetchInstance = wrapFetch(baseUrl);

    const discordRatelimitHandlerMiddleware =
      (next: FetchLike) => async (url: string, opts: WretchOptions) => {
        let response = await next(url, opts);

        if (response.status === 429) {
          const retryAfter = Number(response.headers.get("retry-after"));
          if (!isNaN(retryAfter)) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryAfter * 1000),
            );
            response = await next(url, opts);
          } else {
            throw new WretchError(
              "Rate limit exceeded without a Retry-After header.",
            );
          }
        }
        return response;
      };
    fetchInstance.middlewares([discordRatelimitHandlerMiddleware]);
    return fetchInstance;
  }
}

const discord = new Discord();

export default discord;
export type * from "discord-api-types/v10";
