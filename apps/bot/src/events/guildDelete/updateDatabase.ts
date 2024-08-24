import type { Guild } from "discord.js";

import { trpc } from "../../trpc";

export default async (guild: Guild) => {
  try {
    await trpc.bot.guilds.leave.mutate({
      guildId: Number(guild.id),
    });
    console.log(`Left guild ${guild.name} (${guild.id})`);
  } catch (error) {
    console.error(error);
  }
};
