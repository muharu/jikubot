import type { ExtendedClient } from "../../shard";
import { trpc } from "../../trpc";

export default async (client: ExtendedClient) => {
  console.log(`${client.user?.tag} is online!`);

  try {
    const { greeting } = await trpc.post.hello.query({ text: "Udin" });
    console.log(greeting);

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
