import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { TRPCError } from "@trpc/server";

import type { schemas } from "../context";
import { common } from "../context";

export async function getUserGuilds(
  accessToken: string,
): Promise<schemas.user.GuildsMe> {
  const route = common.utils.discord.routes.userGuilds();

  try {
    const data = await common.utils.discord.fetch
      .url(route)
      .headers({ Authorization: `Bearer ${accessToken}` })
      .get()
      .json<RESTGetAPICurrentUserGuildsResult>();

    return data.map(({ id, name, permissions, icon }) => ({
      id,
      name,
      permissions,
      icon,
    }));
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      cause: process.env.NODE_ENV === "development" && error,
    });
  }
}

export async function getBotGuilds() {
  const route = common.utils.discord.routes.userGuilds();

  try {
    const data = await common.utils.discord.fetch
      .url(route)
      .headers({ Authorization: `Bot ${process.env.BOT_DISCORD_TOKEN}` })
      .get()
      .json<RESTGetAPICurrentUserGuildsResult>();

    return data.map(({ id, name, permissions, icon }) => ({
      id,
      name,
      permissions,
      icon,
    }));
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      cause: process.env.NODE_ENV === "development" && error,
    });
  }
}

export async function getManagedGuilds(accessToken: string) {
  const [userGuilds, botGuilds] = await Promise.all([
    getUserGuilds(accessToken),
    getBotGuilds(),
  ]);

  // Filter the userGuilds to only those with MANAGE_GUILD permission
  const managedGuilds = userGuilds.filter((guild) => {
    return common.utils.bitfields.hasPermission(
      Number(guild.permissions),
      "MANAGE_GUILD",
    );
  });

  // Further filter to only include guilds present in botGuilds
  const guilds = managedGuilds
    .filter((guild) => {
      return botGuilds.some((botGuild) => botGuild.id === guild.id);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return guilds;
}
