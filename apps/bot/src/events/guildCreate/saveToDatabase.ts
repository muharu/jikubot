import type { Guild } from "discord.js";

import { trpc } from "../../trpc";

export default async (guild: Guild) => {
  try {
    await trpc.user.botAddGuild.mutate({
      id: guild.id,
    });
    console.log(`Added guild ${guild.name} to the database`);
  } catch (error) {
    console.error(error);
  }
};
