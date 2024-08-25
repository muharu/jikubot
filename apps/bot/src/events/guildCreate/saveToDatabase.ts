import type { Guild } from "discord.js";

import { trpc } from "../../trpc";
import { retry } from "../../utils";

export default async (guild: Guild) => {
  try {
    await retry(() =>
      trpc.bot.guilds.add.mutate({
        guildId: Number(guild.id),
        ownerId: Number(guild.ownerId),
        name: guild.name,
        icon: guild.icon,
      }),
    );
    console.log(`Added guild ${guild.name} to the database`);
  } catch (error) {
    console.error(error);
  }
};
