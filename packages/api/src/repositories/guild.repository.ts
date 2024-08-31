import { and, db, eq, exists, guilds, userGuilds } from "@giverve/db";

import type { InsertGuild } from "../common/types";

export async function findManyActiveGuilds(trx = db) {
  return trx.select().from(guilds).where(eq(guilds.isActive, true));
}

export function findGuildByGuildId(guildId: bigint, trx = db) {
  return trx.select().from(guilds).where(eq(guilds.guildId, guildId));
}

export function findOneGuildWithPermissions(guildId: bigint, trx = db) {
  return trx
    .select({
      id: guilds.id,
      name: guilds.name,
      permissions: userGuilds.permissions,
      icon: guilds.icon,
      isJoined: guilds.isActive,
    })
    .from(guilds)
    .where(eq(guilds.guildId, guildId))
    .leftJoin(userGuilds, eq(guilds.guildId, userGuilds.guildId));
}

export async function upsertGuildWithActiveStatus(
  data: InsertGuild,
  isActive: boolean,
  trx = db,
) {
  return trx
    .insert(guilds)
    .values(data)
    .onConflictDoUpdate({
      target: guilds.guildId,
      set: {
        isActive,
      },
    })
    .returning();
}

export async function updateGuildByGuildId(data: InsertGuild, trx = db) {
  return trx
    .update(guilds)
    .set({
      name: data.name,
      icon: data.icon,
      ownerId: data.ownerId,
    })
    .where(eq(guilds.guildId, data.guildId));
}

export async function updateGuildActiveStatusIfExists(
  guildId: bigint,
  isActive: boolean,
  trx = db,
) {
  return trx
    .update(guilds)
    .set({
      isActive,
    })
    .where(
      and(
        eq(guilds.guildId, guildId),
        exists(findGuildByGuildId(guildId, trx)),
      ),
    )
    .returning();
}
