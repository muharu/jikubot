import { db, eq, tokens } from "@giverve/db";

export async function findUserTokensByDiscordId(userId: number, trx = db) {
  return await trx.query.tokens.findFirst({
    where: (tokens, { eq }) => eq(tokens.discordId, userId),
  });
}

export async function insertUserTokens(data: InsertTokens, trx = db) {
  return await trx.insert(tokens).values(data).returning();
}

export async function updateUserTokensByDiscordId(
  discordId: number,
  data: InsertTokens,
  trx = db,
) {
  return await trx
    .update(tokens)
    .set(data)
    .where(eq(tokens.discordId, discordId))
    .returning();
}

export type InsertTokens = typeof tokens.$inferInsert;
export type SelectTokens = typeof tokens.$inferSelect;
