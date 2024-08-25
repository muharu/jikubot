import { db, users } from "@giverve/db";

export async function upsertUser(data: InsertUser, trx = db) {
  return trx
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.discordId,
      set: {
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        globalName: data.globalName,
      },
    })
    .returning();
}

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
