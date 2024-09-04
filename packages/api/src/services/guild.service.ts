import type {
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildEmojisResult,
} from "discord-api-types/v10";
import { TRPCError } from "@trpc/server";
import { ChannelType } from "discord-api-types/v10";

import type { GuildMe } from "@giverve/validators";

import { common } from "../context";
import { findOneGuildWithPermissions } from "../repositories/guild.repository";

export async function getGuildWithPermissions(
  guildId: bigint,
): Promise<GuildMe> {
  const cacheKey = `guild:${String(guildId)}`;
  const cacheData =
    await common.utils.cache.inMemoryCache.get<GuildMe>(cacheKey);
  if (cacheData) {
    return cacheData;
  } else {
    const [data] = await findOneGuildWithPermissions(guildId);
    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }
    if (!data.isJoined) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }
    const guild: GuildMe = {
      id: String(data.id),
      name: String(data.name),
      permissions: String(data.permissions),
      isJoined: data.isJoined,
      icon: data.icon,
    };
    await common.utils.cache.inMemoryCache.set(cacheKey, guild, 5_000);
    return guild;
  }
}

export async function getGuildEmojis(
  guildId: bigint,
): Promise<RESTGetAPIGuildEmojisResult> {
  const cacheKey = `guildEmojis:${String(guildId)}`;
  const cacheData =
    await common.utils.cache.inMemoryCache.get<RESTGetAPIGuildEmojisResult>(
      cacheKey,
    );
  if (cacheData) {
    return cacheData;
  } else {
    const route = common.utils.discord.routes.guildEmojis(String(guildId));
    const data = await common.utils.discord.fetch
      .url(route)
      .headers({
        Authorization: `Bot ${process.env.BOT_DISCORD_TOKEN}`,
      })
      .get()
      .json<RESTGetAPIGuildEmojisResult>();
    await common.utils.cache.inMemoryCache.set(cacheKey, data, 5_000);
    return data;
  }
}

export async function getGuildChannels(guildId: bigint) {
  const data = await common.utils.discord.fetch
    .url(`/guilds/${String(guildId)}/channels`)
    .headers({
      Authorization: `Bot ${process.env.BOT_DISCORD_TOKEN}`,
    })
    .get()
    .json<RESTGetAPIGuildChannelsResult>();

  // Filter for text channels
  const textChannels = data.filter(
    (channel) => channel.type === ChannelType.GuildText,
  );

  // Filter text channels where the bot has SEND_MESSAGES permission
  const textChannelsWithPermissions = textChannels.filter((channel) => {
    const botOverwrite = channel.permission_overwrites?.find(
      ({ id }) => id === String(process.env.AUTH_DISCORD_ID),
    );

    if (!botOverwrite) {
      // If no overwrite is found, you might want to assume default role-based permissions
      // For simplicity, let's assume the bot has permission if there are no overwrites
      return true;
    }

    // Calculate effective permissions
    const isDenied = common.utils.bitfields.hasPermissions(
      Number(botOverwrite.deny),
      ["SEND_MESSAGES"],
    );

    if (isDenied) return false;

    const isAllowed = common.utils.bitfields.hasPermissions(
      Number(botOverwrite.allow),
      ["SEND_MESSAGES"],
    );

    return isAllowed;
  });

  return textChannelsWithPermissions;
}
