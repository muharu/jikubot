import { TRPCError } from "@trpc/server";

import type {
  CreateEventResponse,
  GetEventResponse,
  UpdateEventResponse,
} from "@giverve/validators";

import type {
  GetEventByDiscordIdAndEventId,
  InsertEvent,
  UpdateEventByDiscordIdAndEventId,
} from "../common/types";
import { common, repositories } from "../context";

export async function sendEventMessage(channelId: bigint) {
  return common.utils.discord.fetch
    .url(`/channels/${channelId}/messages`)
    .headers({
      Authorization: `Bot ${process.env.BOT_DISCORD_TOKEN}`,
    })
    .post({
      content: "Test Message From Dashboard",
    })
    .json();
}

export async function getEvent(
  data: GetEventByDiscordIdAndEventId,
): Promise<GetEventResponse & { discordId: string }> {
  const [event] = await repositories.event.getEventByDiscordIdAndEventId(data);
  if (!event) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return {
    eventId: String(event.id),
    discordId: String(event.discordId),
    title: event.title,
    description: event.description,
  };
}

export async function createEvent(
  data: InsertEvent,
): Promise<CreateEventResponse> {
  const [event] = await repositories.event.insertEvent(data);
  return {
    eventId: String(event?.id),
    title: String(event?.title),
    description: String(event?.description),
  };
}

export async function updateEvent(
  data: UpdateEventByDiscordIdAndEventId,
): Promise<UpdateEventResponse> {
  const [updatedEvent] =
    await repositories.event.updateEventByDiscordIdAndEventId(data);
  if (!updatedEvent) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return {
    eventId: String(updatedEvent.id),
    title: updatedEvent.title,
    description: updatedEvent.description,
  };
}
