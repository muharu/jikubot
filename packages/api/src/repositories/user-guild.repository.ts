import { and, db, eq, notInArray, userGuilds } from "@giverve/db";

import type { InsertUserGuilds } from "../common/types";

export async function findManyUserGuildsByDiscordId(
  discordId: bigint,
  trx = db,
) {
  return trx.query.userGuilds.findMany({
    where: eq(userGuilds.discordId, discordId),
  });
}

export async function findFirstUserGuildByDiscordId(
  discordId: bigint,
  trx = db,
) {
  return trx.query.users.findFirst({
    where: (user, { eq }) => eq(user.discordId, discordId),
  });
}

export async function updateUserGuildPermissionsByDiscordIdAndGuildId(
  discordId: bigint,
  guildId: bigint,
  permissions: bigint,
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
  discordId: bigint,
  guildIds: bigint[],
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
