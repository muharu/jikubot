import type { ExtendedClient } from "../../shard";

export default async (client: ExtendedClient) => {
  console.log(`${client.user?.tag} is online!`);

  try {
    if (client.cluster) {
      const totalGuilds = await getTotalGuildsFromShards(client);
      console.log(`${totalGuilds} total guilds`);
    }
  } catch (error) {
    console.error(error);
  }
};

async function getTotalGuildsFromShards(client: ExtendedClient) {
  if (client.cluster) {
    const guildCounts = await client.cluster.broadcastEval(
      (c) => c.guilds.cache.size,
    );
    const totalGuilds = guildCounts.reduce((sum, count) => sum + count, 0);
    return totalGuilds;
  }
}
