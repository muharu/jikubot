import { discordApiFetchInstance, discordApiRoutes } from "./lib/fetch-wrapper";

class Discord {
  public fetch: typeof discordApiFetchInstance;
  public routes: typeof discordApiRoutes;

  constructor() {
    this.fetch = discordApiFetchInstance;
    this.routes = discordApiRoutes;
  }
}

const discord = new Discord();

export default discord;
export type * from "discord-api-types/v10";
