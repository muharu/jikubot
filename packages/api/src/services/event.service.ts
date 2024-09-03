import type { CreateEventRequest } from "@giverve/validators";

import { common } from "../context";

export async function sendEventMessage(data: CreateEventRequest) {
  const color = 0xfc7303;

  return common.utils.discord.fetch
    .url(`/channels/${data.eventSetup.channelId}/messages`)
    .headers({
      Authorization: `Bot ${process.env.BOT_DISCORD_TOKEN}`,
    })
    .post({
      embeds: [
        {
          title: data.eventSetup.title,
          description: data.eventSetup.description,
          color,
          fields: data.eventInteractions.map((interaction) => ({
            name: `<:${interaction.name.toLowerCase()}:${interaction.id}> ${interaction.name} (${interaction.limit})`,
            value: "-",
            inline: true,
          })),
          footer: {
            text: "Event Created | Powered by Groupoop",
            icon_url: "https://c.tenor.com/3_SGmIxSC4oAAAAC/tenor.gif",
          },
        },
      ],
      components: [
        {
          type: 1,
          components: data.eventInteractions.map((interaction) => ({
            type: 2, // Secondary button style
            style: 2,
            custom_id: interaction.id,
            emoji: {
              name: interaction.name, // Add the emoji name here
              id: interaction.id, // Add the emoji ID here if using a custom emoji
            },
          })),
        },
      ],
    })
    .json();
}
