import { ClusterManager } from "discord-hybrid-sharding";

const manager = new ClusterManager(`${__dirname}/shard.js`, {
  totalShards: "auto", // or numeric shard count
  /// Check below for more options
  shardsPerClusters: 2, // 2 shards per process
  // totalClusters: 7,
  mode: "process", // you can also choose "worker"
  token: process.env.BOT_DISCORD_TOKEN,
});

manager.on("clusterCreate", (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`),
);

void manager.spawn({ timeout: -1 });
