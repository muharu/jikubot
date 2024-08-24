import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v10";
import { TRPCError } from "@trpc/server";

import { and, eq, notInArray, userGuilds } from "@giverve/db";

import type { schemas } from "../context";
import { common } from "../context";

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

  // Fetch guilds
  const [userGuilds, botGuilds] = await Promise.all([
    syncUserGuilds(discordId, accessToken),
    getBotGuilds(),
  ]);

  // Create a Set for botGuilds IDs
  const botGuildSet = new Set(botGuilds.map((botGuild) => botGuild.id));

  // Separate the guilds into joined and unjoined
  const guilds = userGuilds.map((guild) => {
    const isManaged = common.utils.bitfields.hasPermission(
      Number(guild.permissions),
      "MANAGE_GUILD",
    );
    const isJoined = botGuildSet.has(guild.id);

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
  await common.utils.cache.inMemoryCache.set(cacheKey, result, 20_000);

  return result;
}

export async function syncUserGuilds(discordId: number, accessToken: string) {
  const userGuildsData = await getUserGuilds(accessToken);

  await common.utils.transaction(async (trx) => {
    for (const guild of userGuildsData) {
      const isManaged = common.utils.bitfields.hasPermission(
        Number(guild.permissions),
        "MANAGE_GUILD",
      );

      const existingGuild = await trx.query.userGuilds.findFirst({
        where: (userGuilds, { eq }) => eq(userGuilds.guildId, Number(guild.id)),
      });

      console.log("Existing guild", existingGuild);

      if (existingGuild) {
        if (
          existingGuild.permissions !== Number(guild.permissions) ||
          existingGuild.isManaged !== isManaged
        ) {
          await trx
            .update(userGuilds)
            .set({
              permissions: Number(guild.permissions),
              isManaged,
            })
            .where(
              and(
                eq(userGuilds.discordId, discordId),
                eq(userGuilds.guildId, Number(guild.id)),
              ),
            );
        }
      } else {
        await trx.insert(userGuilds).values({
          discordId: discordId,
          guildId: Number(guild.id),
          permissions: Number(guild.permissions),
          isManaged,
        });
      }

      // Optionally: Remove any guilds that the user is no longer a part of
      const guildIds = userGuildsData.map((guild) => Number(guild.id));
      await trx
        .delete(userGuilds)
        .where(
          and(
            eq(userGuilds.discordId, discordId),
            notInArray(userGuilds.guildId, guildIds),
          ),
        );
    }
  });

  return userGuildsData;
}
