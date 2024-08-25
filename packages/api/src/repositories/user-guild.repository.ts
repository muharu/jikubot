import { and, db, eq, notInArray, userGuilds } from "@giverve/db";

export async function findManyUserGuildsByDiscordId(
  discordId: number,
  trx = db,
) {
  return trx.query.userGuilds.findMany({
    where: eq(userGuilds.discordId, discordId),
  });
}

export async function findFirstUserGuildByDiscordId(
  discordId: number,
  trx = db,
) {
  return trx.query.users.findFirst({
    where: (user, { eq }) => eq(user.discordId, discordId),
  });
}

export async function updateUserGuildPermissionsByDiscordIdAndGuildId(
  discordId: number,
  guildId: number,
  permissions: number,
  trx = db,
) {
  return trx
    .update(userGuilds)
    .set({ permissions })
    .where(
      and(eq(userGuilds.discordId, discordId), eq(userGuilds.guildId, guildId)),
    );
}

export async function insertUserGuilds(data: InsertUserGuilds, trx = db) {
  return trx.insert(userGuilds).values(data);
}

export async function deleteUserGuildsByGuildIds(
  discordId: number,
  guildIds: number[],
  trx = db,
) {
  return trx
    .delete(userGuilds)
    .where(
      and(
        eq(userGuilds.discordId, discordId),
        notInArray(userGuilds.guildId, guildIds),
      ),
    );
}

export type InsertUserGuilds = typeof userGuilds.$inferInsert;
export type SelectUserGuilds = typeof userGuilds.$inferSelect;
