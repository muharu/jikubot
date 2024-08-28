import { and, db, eq, events } from "@giverve/db";

import type {
  GetEventByDiscordIdAndEventId,
  InsertEvent,
  UpdateEventByDiscordIdAndEventId,
} from "../common/types";

export async function getEventByDiscordIdAndEventId(
  data: GetEventByDiscordIdAndEventId,
  trx = db,
) {
  return trx
    .select()
    .from(events)
    .where(
      and(eq(events.id, data.eventId), eq(events.discordId, data.discordId)),
    );
}

export async function insertEvent(data: InsertEvent, trx = db) {
  return trx.insert(events).values(data).returning({
    id: events.id,
    title: events.title,
    description: events.description,
  });
}

export async function updateEventByDiscordIdAndEventId(
  data: UpdateEventByDiscordIdAndEventId,
  trx = db,
) {
  return trx
    .update(events)
    .set({
      title: data.title,
      description: data.description,
    })
    .where(
      and(eq(events.id, data.eventId), eq(events.discordId, data.discordId)),
    )
    .returning();
}
