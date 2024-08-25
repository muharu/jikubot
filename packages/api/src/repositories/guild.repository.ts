import { db, eq, guilds } from "@giverve/db";

export async function findManyActiveGuilds(trx = db) {
  return await trx.query.guilds.findMany({
    where: (guilds, { eq }) => eq(guilds.isActive, true),
  });
}

export async function findGuildById(id: number, trx = db) {
  return await trx.query.guilds.findFirst({
    where: (guilds, { eq }) => eq(guilds.guildId, id),
  });
}

export async function insertGuild(data: InsertGuild, trx = db) {
  await trx.insert(guilds).values(data).returning();
}

export async function updateGuildActiveStatus(
  guildId: number,
  isActive = true,
  trx = db,
) {
  await trx
    .update(guilds)
    .set({
      isActive,
    })
    .where(eq(guilds.guildId, guildId))
    .returning();
}

export async function upsertGuildWithActiveStatus(
  data: InsertGuild,
  isActive = true,
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

export type InsertGuild = typeof guilds.$inferInsert;
export type SelectGuild = typeof guilds.$inferSelect;
