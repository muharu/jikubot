import { bigint, boolean, pgTable, varchar } from "drizzle-orm/pg-core";

import { snowflake } from "./generate";

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => Number(snowflake.generateId())),
  discordId: bigint("discord_id", { mode: "number" }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  avatar: varchar("avatar", { length: 100 }),
  globalName: varchar("global_name", { length: 100 }).notNull(),
});

export const tokens = pgTable("tokens", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => Number(snowflake.generateId())),
  discordId: bigint("discord_id", { mode: "number" })
    .unique()
    .notNull()
    .references(() => users.discordId),
  accessToken: varchar("access_token", { length: 100 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 100 }).notNull(),
});

export const guilds = pgTable("guilds", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => Number(snowflake.generateId())),
  guildId: bigint("guild_id", { mode: "number" }).notNull().unique(),
  isPremium: boolean("is_premium").notNull().default(false),
});
