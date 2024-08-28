import type { APIUser } from "discord-api-types/v10";
import type { JWTPayload } from "jose";

import type { events, guilds, tokens, userGuilds, users } from "@giverve/db";

export interface User
  extends Pick<APIUser, "id" | "username" | "email" | "avatar"> {
  globalName: string | null | undefined;
}

export interface ExtendedJWTPayload extends User, Pick<JWTPayload, "exp"> {}

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertGuild = typeof guilds.$inferInsert;
export type SelectGuild = typeof guilds.$inferSelect;

export type InsertTokens = typeof tokens.$inferInsert;
export type SelectTokens = typeof tokens.$inferSelect;

export type InsertUserGuilds = typeof userGuilds.$inferInsert;
export type SelectUserGuilds = typeof userGuilds.$inferSelect;

export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;
export type GetEventByDiscordIdAndEventId = Pick<SelectEvent, "discordId"> & {
  eventId: SelectEvent["id"];
};
export type UpdateEventByDiscordIdAndEventId = Pick<
  InsertEvent,
  "discordId" | "title" | "description"
> & {
  eventId: SelectEvent["id"];
};
