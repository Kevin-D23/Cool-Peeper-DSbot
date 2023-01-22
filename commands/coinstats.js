const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gamble = require("../commandFunctions/gamble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinstats")
    .setDescription("Check coin flip stats"),
  async execute(interaction) {
    let msg = await gamble.coinStats();
    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setDescription(msg)
      .setColor(embedColors.mainColor);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
