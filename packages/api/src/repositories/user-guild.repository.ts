import { db, eq, userGuilds } from "@giverve/db";

export function findManyUserGuildsByDiscordId(discordId: number, trx = db) {
  return trx
    .select()
    .from(userGuilds)
    .where(eq(userGuilds.discordId, discordId));
}
