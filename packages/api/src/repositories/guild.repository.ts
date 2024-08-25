import { and, db, eq, exists, guilds } from "@giverve/db";

export async function findManyActiveGuilds(trx = db) {
  return trx.select().from(guilds).where(eq(guilds.isActive, true));
}

export function findGuildByGuildId(guildId: number, trx = db) {
  return trx.select().from(guilds).where(eq(guilds.guildId, guildId));
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

export async function updateGuildActiveStatusIfExists(
  guildId: number,
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

export type InsertGuild = typeof guilds.$inferInsert;
export type SelectGuild = typeof guilds.$inferSelect;
