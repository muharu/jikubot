import type { Guild } from "discord.js";

import { common, repositories } from "@giverve/api";

export default async (guild: Guild) => {
  try {
    await common.utils.transaction(async (trx) => {
      const data = await repositories.guild.findGuildById(
        Number(guild.id),
        trx,
      );

      if (!data) {
        await repositories.guild.insertGuild(
          {
            guildId: Number(guild.id),
            name: guild.name,
            icon: guild.icon,
            ownerId: Number(guild.ownerId),
          },
          trx,
        );
      }
    });
    console.log(`Added guild ${guild.name} to the database`);
  } catch (error) {
    console.error(error);
  }
};
