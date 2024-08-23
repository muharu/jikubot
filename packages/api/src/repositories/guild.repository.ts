import { db, guilds } from "@giverve/db";

export async function findGuildById(id: number, trx = db) {
  return await trx.query.guilds.findFirst({
    where: (guilds, { eq }) => eq(guilds.guildId, id),
  });
}

export async function insertGuild(data: InsertGuild, trx = db) {
  await trx.insert(guilds).values(data).returning();
}

export type InsertGuild = typeof guilds.$inferInsert;
export type SelectGuild = typeof guilds.$inferSelect;
