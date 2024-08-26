import type { Guild } from "discord.js";

import { trpc } from "../../trpc";
import { retry } from "../../utils";

export default async (guild: Guild) => {
  try {
    await retry(() =>
      trpc.bot.guilds.leave.mutate({
        guildId: guild.id,
      }),
    );
    console.log(`Left guild ${guild.name} (${guild.id})`);
  } catch (error) {
    console.error(`Failed to leave guild ${guild.name}:`, error);
  }
};
