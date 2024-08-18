import { Routes } from "discord-api-types/v10";

import { discordApiFetchInstance } from "./lib/fetch-wrapper";

const discord = {
  fetch: discordApiFetchInstance,
  routes: Routes,
};

export default discord;
export type * from "discord-api-types/v10";
