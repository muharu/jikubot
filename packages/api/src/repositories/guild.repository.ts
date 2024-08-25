import { and, db, eq, exists, guilds } from "@giverve/db";

export async function findManyActiveGuilds(trx = db) {
  return await trx.query.guilds.findMany({
    where: (guilds, { eq }) => eq(guilds.isActive, true),
  });
}

export function findGuildBGuildId(guildId: number, trx = db) {
  return trx.select().from(guilds).where(eq(guilds.guildId, guildId));
}

export async function upsertGuildWithActiveStatus(
  data: InsertGuild,
  isActive: boolean,
  trx = db,
) {
  return await trx
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
  return await trx
    .update(guilds)
    .set({
      isActive,
    })
    .where(
      and(eq(guilds.guildId, guildId), exists(findGuildBGuildId(guildId, trx))),
    )
    .returning();
}

export type InsertGuild = typeof guilds.$inferInsert;
export type SelectGuild = typeof guilds.$inferSelect;
