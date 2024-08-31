import { TRPCError } from "@trpc/server";

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
