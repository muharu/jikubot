import { db, tokens } from "@giverve/db";

import type { InsertTokens } from "../common/types";

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
