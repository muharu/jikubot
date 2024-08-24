import type { Guild } from "discord.js";

import { trpc } from "../../trpc";

export default async (guild: Guild) => {
  try {
    await trpc.bot.inserGuilds.mutate({
      guildId: Number(guild.id),
      ownerId: Number(guild.ownerId),
      name: guild.name,
      icon: guild.icon,
    });
    console.log(`Added guild ${guild.name} to the database`);
  } catch (error) {
    console.error(error);
  }
};
