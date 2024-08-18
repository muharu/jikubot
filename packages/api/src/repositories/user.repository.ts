import { db, eq, tokens, users } from "@giverve/db";

export async function findUserByDiscordId(discordId: number, ctx = db) {
  return await ctx.query.users.findFirst({
    where: (users, { eq }) => eq(users.discordId, discordId),
  });
}

export async function insertUser(data: typeof users.$inferInsert, ctx = db) {
  return await ctx.insert(users).values(data).returning();
}

export async function updateUserByDiscordId(
  discordId: number,
  data: typeof users.$inferInsert,
  ctx = db,
) {
  return await ctx
    .update(users)
    .set(data)
    .where(eq(users.discordId, discordId))
    .returning();
}

export async function findUserTokensByDiscordId(userId: number, ctx = db) {
  return await ctx.query.tokens.findFirst({
    where: (tokens, { eq }) => eq(tokens.discordId, userId),
  });
}

export async function insertUserTokens(
  data: typeof tokens.$inferInsert,
  ctx = db,
) {
  return await ctx.insert(tokens).values(data).returning();
}

export async function updateUserTokensByDiscordId(
  discordId: number,
  data: typeof tokens.$inferInsert,
  ctx = db,
) {
  return await ctx
    .update(tokens)
    .set(data)
    .where(eq(tokens.discordId, discordId))
    .returning();
}

const userRepository = {
  findUserByDiscordId,
  insertUser,
  updateUserByDiscordId,
  findUserTokensByDiscordId,
  insertUserTokens,
  updateUserTokensByDiscordId,
};

export default userRepository;
