import { db, eq, userGuilds } from "@giverve/db";

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
