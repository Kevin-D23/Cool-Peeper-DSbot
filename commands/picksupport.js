const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gameSelect = require("../commandFunctions/pickGameFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("picksupport")
    .setDescription("Pick a random overwatch support to play"),
  async execute(interaction) {
    let msg = gameSelect.pickHero("support");
    let embed = new EmbedBuilder()
      .setTitle("Game Selector")
      .setDescription(msg)
      .setColor(embedColors.mainColor);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
