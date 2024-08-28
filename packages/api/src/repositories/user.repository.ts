import { db, users } from "@giverve/db";

import type { InsertUser } from "../common/types";

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
