import type {
  CommandData,
  CommandOptions,
  SlashCommandProps,
} from "commandkit";

export const data: CommandData = {
  name: "ping",
  description: "Replies with Pong",
};

export const run = async ({ interaction }: SlashCommandProps) => {
  await interaction.reply("Pong!");
};

export const options: CommandOptions = {
  // https://commandkit.js.org/typedef/CommandOptions
};
