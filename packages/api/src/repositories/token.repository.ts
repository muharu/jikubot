import { db, tokens } from "@giverve/db";

export async function upsertUserTokens(data: InsertTokens, trx = db) {
  return trx
    .insert(tokens)
    .values(data)
    .onConflictDoUpdate({
      target: tokens.discordId,
      set: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    })
    .returning();
}

export type InsertTokens = typeof tokens.$inferInsert;
export type SelectTokens = typeof tokens.$inferSelect;
