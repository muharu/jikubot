import type { FetchLike, WretchOptions } from "wretch";
import { Routes } from "discord-api-types/v10";
import wretch from "wretch";
import { WretchError } from "wretch/resolver";

class DiscordApiFetchWrapper {
  private fetchInstance;

  constructor(baseUrl: string) {
    this.fetchInstance = wretch(baseUrl);
    this.setupMiddlewares();
  }

  private setupMiddlewares() {
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

    this.fetchInstance.middlewares([discordRatelimitHandlerMiddleware]);
  }

  public getFetchInstance() {
    return this.fetchInstance;
  }

  public getRoutes() {
    return Routes;
  }
}

const DISCORD_API_VERSION = 10;
const DISCORD_API_BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;

const discordApiClient = new DiscordApiFetchWrapper(DISCORD_API_BASE_URL);
export const discordApiFetchInstance = discordApiClient.getFetchInstance();
export const discordApiRoutes = discordApiClient.getRoutes();
