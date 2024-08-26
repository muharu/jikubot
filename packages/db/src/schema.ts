import { sql } from "drizzle-orm";
import { bigint, boolean, index, pgTable, varchar } from "drizzle-orm/pg-core";

import { snowflake } from "./generate";

export const users = pgTable("users", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => BigInt(snowflake.generateId())),
  discordId: bigint("discord_id", { mode: "bigint" }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  avatar: varchar("avatar", { length: 100 }),
  globalName: varchar("global_name", { length: 100 }).notNull(),
  joinedAt: bigint("joined_at", { mode: "bigint" })
    .notNull()
    .default(sql`extract(epoch from now())`),
});

export const tokens = pgTable("tokens", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => BigInt(snowflake.generateId())),
  discordId: bigint("discord_id", { mode: "bigint" })
    .notNull()
    .unique()
    .references(() => users.discordId),
  accessToken: varchar("access_token", { length: 100 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 100 }).notNull(),
});

export const guilds = pgTable("guilds", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => BigInt(snowflake.generateId())),
  guildId: bigint("guild_id", { mode: "bigint" }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  ownerId: bigint("owner_id", { mode: "bigint" }),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: bigint("joined_at", { mode: "bigint" })
    .notNull()
    .default(sql`extract(epoch from now())`),
});

export const userGuilds = pgTable(
  "user_guilds",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .notNull()
      .$defaultFn(() => BigInt(snowflake.generateId())),
    discordId: bigint("discord_id", { mode: "bigint" })
      .notNull()
      .references(() => users.discordId),
    guildId: bigint("guild_id", { mode: "bigint" }).notNull(),
    permissions: bigint("permissions", { mode: "bigint" }).notNull(),
  },
  (table) => ({
    userGuildIndex: index("user_guild_index").on(
      table.discordId,
      table.guildId,
    ),
  }),
);

export const events = pgTable("events", {
  id: bigint("id", { mode: "bigint" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => BigInt(snowflake.generateId())),
  discordId: bigint("discord_id", { mode: "bigint" }).notNull(),
  messageId: bigint("message_id", { mode: "bigint" }),
  title: varchar("name", { length: 50 }).notNull(),
  description: varchar("description", { length: 150 }),
  createdAt: bigint("created_at", { mode: "bigint" })
    .notNull()
    .default(sql`extract(epoch from now())`),
});
