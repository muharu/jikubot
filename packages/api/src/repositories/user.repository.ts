import { db, eq, users } from "@giverve/db";

export async function findUserByDiscordId(discordId: number, trx = db) {
  return await trx.query.users.findFirst({
    where: (users, { eq }) => eq(users.discordId, discordId),
  });
}

export async function insertUser(data: InsertUser, trx = db) {
  return await trx.insert(users).values(data).returning();
}

export async function updateUserByDiscordId(
  discordId: number,
  data: InsertUser,
  trx = db,
) {
  return await trx
    .update(users)
    .set(data)
    .where(eq(users.discordId, discordId))
    .returning();
}

export async function upsertUser(data: InsertUser, trx = db) {
  return await trx
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.discordId,
      set: data,
    })
    .returning();
}

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
