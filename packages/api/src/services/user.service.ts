import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { TRPCError } from "@trpc/server";

import { common } from "../context";

export async function getUserGuilds(accessToken: string) {
  const route = common.utils.discord.routes.userGuilds();

  try {
    return await common.utils.discord.fetch
      .url(route)
      .headers({ Authorization: `Bearer ${accessToken}` })
      .get()
      .json<RESTGetAPICurrentUserGuildsResult>();
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      cause: process.env.NODE_ENV === "development" && error,
    });
  }
}
