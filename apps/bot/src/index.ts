import path from "node:path";
import { CommandKit } from "commandkit";
import { Client, IntentsBitField } from "discord.js";

const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

new CommandKit({
  client,
  eventsPath: path.join(__dirname, "events"),
  commandsPath: path.join(__dirname, "commands"),
});

void client.login(process.env.BOT_DISCORD_TOKEN);
