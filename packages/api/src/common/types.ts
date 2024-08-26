import type { APIUser } from "discord-api-types/v10";
import type { JWTPayload } from "jose";

import type { guilds, tokens, userGuilds } from "@giverve/db";

export type User = Pick<
  APIUser,
  "id" | "username" | "email" | "avatar" | "global_name"
>;

export interface ExtendedJWTPayload extends User, Pick<JWTPayload, "exp"> {}

export type InsertGuild = typeof guilds.$inferInsert;
export type SelectGuild = typeof guilds.$inferSelect;

export type InsertTokens = typeof tokens.$inferInsert;
export type SelectTokens = typeof tokens.$inferSelect;

export type InsertUserGuilds = typeof userGuilds.$inferInsert;
export type SelectUserGuilds = typeof userGuilds.$inferSelect;
