import type { FetchLike, Wretch, WretchOptions } from "wretch";
import { Routes } from "discord-api-types/v10";
import wretch from "wretch";
import { WretchError } from "wretch/resolver";

class Discord {
  public fetch: Wretch;
  public routes = Routes;

  constructor(apiVersion = 10) {
    const baseUrl = `https://discord.com/api/v${apiVersion}`;
    this.fetch = this.createFetchInstance(baseUrl);
  }

  private createFetchInstance(baseUrl: string): Wretch {
    const fetchInstance = wretch(baseUrl);
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

  public generateDiscordAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: String(process.env.AUTH_DISCORD_ID),
      redirect_uri: String(process.env.API_BASE_URL + "/authorize"),
      response_type: "code",
      scope: "identify email guilds",
      state,
    });
    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }
}

const discord = new Discord();

export default discord;
export type * from "discord-api-types/v10";
