import { sql } from "drizzle-orm";
import { bigint, boolean, index, pgTable, varchar } from "drizzle-orm/pg-core";

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
  joinedAt: bigint("joined_at", { mode: "number" })
    .notNull()
    .default(sql`extract(epoch from now())`),
});

export const tokens = pgTable("tokens", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .notNull()
    .$defaultFn(() => Number(snowflake.generateId())),
  discordId: bigint("discord_id", { mode: "number" })
    .notNull()
    .unique()
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
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  ownerId: bigint("owner_id", { mode: "number" }),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: bigint("joined_at", { mode: "number" })
    .notNull()
    .default(sql`extract(epoch from now())`),
});

export const userGuilds = pgTable(
  "user_guilds",
  {
    id: bigint("id", { mode: "number" })
      .primaryKey()
      .notNull()
      .$defaultFn(() => Number(snowflake.generateId())),
    discordId: bigint("discord_id", { mode: "number" })
      .notNull()
      .references(() => users.discordId),
    guildId: bigint("guild_id", { mode: "number" }).notNull(),
    permissions: bigint("permissions", { mode: "number" }).notNull(),
    joinedAt: bigint("joined_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
  },
  (table) => ({
    userGuildIndex: index("user_guild_index").on(
      table.discordId,
      table.guildId,
    ),
  }),
);
