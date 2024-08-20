import { eq, users } from "@giverve/db";

import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {
  public async findUserByDiscordId(discordId: number, trx = this.trx) {
    return await trx.query.users.findFirst({
      where: (users, { eq }) => eq(users.discordId, discordId),
    });
  }

  public async insertUser(data: InsertUser, trx = this.trx) {
    return await trx.insert(users).values(data).returning();
  }

  public async updateUserByDiscordId(
    discordId: number,
    data: InsertUser,
    trx = this.trx,
  ) {
    return await trx
      .update(users)
      .set(data)
      .where(eq(users.discordId, discordId))
      .returning();
  }
}

export default new UserRepository();
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
