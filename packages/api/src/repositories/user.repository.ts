import { eq, users } from "@giverve/db";

import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {
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
}

export default new UserRepository();

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
