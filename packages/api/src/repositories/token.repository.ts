import { eq, tokens } from "@giverve/db";

import { BaseRepository } from "./base.repository";

export class TokenRepository extends BaseRepository {
  public async findUserTokensByDiscordId(userId: number, trx = this.trx) {
    return await trx.query.tokens.findFirst({
      where: (tokens, { eq }) => eq(tokens.discordId, userId),
    });
  }

  public async insertUserTokens(data: InsertTokens, trx = this.trx) {
    return await trx.insert(tokens).values(data).returning();
  }

  public async updateUserTokensByDiscordId(
    discordId: number,
    data: InsertTokens,
    trx = this.trx,
  ) {
    return await trx
      .update(tokens)
      .set(data)
      .where(eq(tokens.discordId, discordId))
      .returning();
  }
}

export default new TokenRepository();
export type InsertTokens = typeof tokens.$inferInsert;
export type SelectTokens = typeof tokens.$inferSelect;
