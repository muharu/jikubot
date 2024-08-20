import { db, eq, tokens, users } from "@giverve/db";

type InsertUser = typeof users.$inferInsert;
type InsertTokens = typeof tokens.$inferInsert;

class UserRepository {
  private ctx;

  constructor() {
    this.ctx = db;
  }

  public async findUserByDiscordId(discordId: number, ctx = this.ctx) {
    return await ctx.query.users.findFirst({
      where: (users, { eq }) => eq(users.discordId, discordId),
    });
  }

  public async insertUser(data: InsertUser, ctx = this.ctx) {
    return await ctx.insert(users).values(data).returning();
  }

  public async updateUserByDiscordId(
    discordId: number,
    data: InsertUser,
    ctx = this.ctx,
  ) {
    return await ctx
      .update(users)
      .set(data)
      .where(eq(users.discordId, discordId))
      .returning();
  }

  public async findUserTokensByDiscordId(userId: number, ctx = this.ctx) {
    return await ctx.query.tokens.findFirst({
      where: (tokens, { eq }) => eq(tokens.discordId, userId),
    });
  }

  public async insertUserTokens(data: InsertTokens, ctx = this.ctx) {
    return await ctx.insert(tokens).values(data).returning();
  }

  public async updateUserTokensByDiscordId(
    discordId: number,
    data: InsertTokens,
    ctx = this.ctx,
  ) {
    return await ctx
      .update(tokens)
      .set(data)
      .where(eq(tokens.discordId, discordId))
      .returning();
  }
}

export default new UserRepository();
