import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { TRPCError } from "@trpc/server";

import { and, eq, guilds, notInArray, userGuilds } from "@giverve/db";

import type { schemas } from "../context";
import { common, repositories } from "../context";
import { findManyUserGuildsByDiscordId } from "../repositories/user-guild.repository";

export async function getUserGuilds(
  accessToken: string,
): Promise<RESTGetAPICurrentUserGuildsResult> {
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

export async function getBotGuilds(): Promise<RESTGetAPICurrentUserGuildsResult> {
  const route = common.utils.discord.routes.userGuilds();

  try {
    return await common.utils.discord.fetch
      .url(route)
      .headers({ Authorization: `Bot ${process.env.BOT_DISCORD_TOKEN}` })
      .get()
      .json<RESTGetAPICurrentUserGuildsResult>();
  } catch (error) {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      cause: process.env.NODE_ENV === "development" && error,
    });
  }
}

export async function getManagedGuilds(
  discordId: number,
  accessToken: string,
): Promise<schemas.user.GuildsMe> {
  const cacheKey = `managedGuilds:${accessToken}`;
  const cachedGuilds =
    await common.utils.cache.inMemoryCache.get<schemas.user.GuildsMe>(cacheKey);

  if (cachedGuilds) {
    return cachedGuilds;
  }

  // get the user guilds from discord api and sync them with the database
  const userGuilds = await syncUserGuilds(discordId, accessToken);

  // get the guilds from the database
  const botGuildsFromDb = await repositories.guild.findManyActiveGuilds();

  // Create a Set for botGuilds IDs
  const botGuildSet = new Set(
    botGuildsFromDb.map((botGuild) => botGuild.guildId),
  );

  // Separate the guilds into joined and unjoined
  const guilds = userGuilds.map((guild) => {
    const isManaged = common.utils.bitfields.hasPermission(
      Number(guild.permissions),
      "MANAGE_GUILD",
    );
    const isJoined = botGuildSet.has(Number(guild.id));

    return {
      ...guild,
      isManaged,
      isJoined,
    };
  });

  // Split the guilds into joined and unjoined based on `isJoined` property
  const [joinedGuilds, unjoinedGuildsWithPermissions] = guilds.reduce(
    ([joined, unjoined], guild) => {
      if (guild.isJoined) {
        joined.push(guild);
      } else if (guild.isManaged) {
        unjoined.push(guild);
      }
      return [joined, unjoined];
    },
    [[], []] as [typeof guilds, typeof guilds],
  );

  // Sort both arrays by guild name
  joinedGuilds.sort((a, b) => a.name.localeCompare(b.name));
  unjoinedGuildsWithPermissions.sort((a, b) => a.name.localeCompare(b.name));

  // Combine results: joined first, then unjoined
  const result = joinedGuilds.concat(unjoinedGuildsWithPermissions);

  // Cache the result
  await common.utils.cache.inMemoryCache.set(cacheKey, result, 8_000);

  return result;
}

export async function joinGuild(data: schemas.bot.BotSaveGuildRequest) {
  try {
    await repositories.guild.upsertGuildWithActiveStatus(data, true);
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: process.env.NODE_ENV === "development" && error,
    });
  }
}

export async function leaveGuild(guildId: number) {
  try {
    await repositories.guild.updateGuildActiveStatusIfExists(guildId, false);
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: process.env.NODE_ENV === "development" && error,
    });
  }
}

export async function syncUserGuilds(discordId: number, accessToken: string) {
  const userGuildsData = await getUserGuilds(accessToken);

  // Filter only the guilds that are managed
  const managedGuildsData = userGuildsData.filter((guild) =>
    common.utils.bitfields.hasPermission(
      Number(guild.permissions),
      "MANAGE_GUILD",
    ),
  );

  await common.utils.transaction(async (trx) => {
    // Fetch existing guilds for the user
    const existingGuilds = await findManyUserGuildsByDiscordId(discordId, trx);

    // Create a map of existing guilds for quick lookup
    const existingGuildsMap = new Map<number, (typeof existingGuilds)[0]>(
      existingGuilds.map((guild) => [guild.guildId, guild]),
    );

    // Insert or update managed guilds
    for (const guild of managedGuildsData) {
      const guildId = Number(guild.id);

      const existingGuild = existingGuildsMap.get(guildId);
      if (existingGuild) {
        const isGuildExist = await trx.query.users.findFirst({
          where: (user, { eq }) => eq(user.discordId, discordId),
        });

        if (guild.owner && isGuildExist) {
          await trx.update(guilds).set({
            name: guild.name,
            icon: guild.icon,
            ownerId: discordId,
          });
        } else if (!guild.owner && isGuildExist) {
          await trx.update(guilds).set({
            name: guild.name,
            icon: guild.icon,
          });
        }

        if (existingGuild.permissions !== Number(guild.permissions)) {
          await trx
            .update(userGuilds)
            .set({
              permissions: Number(guild.permissions),
            })
            .where(
              and(
                eq(userGuilds.discordId, discordId),
                eq(userGuilds.guildId, guildId),
              ),
            );
        }

        // Remove the guild from the map to know which guilds need to be deleted
        existingGuildsMap.delete(guildId);
      } else {
        await trx.insert(userGuilds).values({
          discordId,
          guildId,
          permissions: Number(guild.permissions),
        });
      }
    }

    // Delete guilds that are no longer in the managed list
    if (existingGuildsMap.size > 0) {
      const guildIdsToDelete = Array.from(existingGuildsMap.keys());
      await trx
        .delete(userGuilds)
        .where(
          and(
            eq(userGuilds.discordId, discordId),
            notInArray(userGuilds.guildId, guildIdsToDelete),
          ),
        );
    }
  });

  return managedGuildsData;
}
