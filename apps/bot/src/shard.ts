import path from "node:path";
import { CommandKit } from "commandkit";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { Client, IntentsBitField } from "discord.js";

export class ExtendedClient extends Client {
  cluster?: ClusterClient<ExtendedClient>;
}

const __dirname = path.dirname(__filename);

export const client = new ExtendedClient({
  shards: getInfo().SHARD_LIST, // An array of shards that will get spawned
  shardCount: getInfo().TOTAL_SHARDS, // Total number of shards
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.cluster = new ClusterClient(client);

new CommandKit({
  client,
  eventsPath: path.join(__dirname, "events"),
  commandsPath: path.join(__dirname, "commands"),
});

void client.login(process.env.BOT_DISCORD_TOKEN);
