const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gameSelect = require("../commandFunctions/pickGameFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pickgame")
    .setDescription("Pick a random game to play"),
  async execute(interaction) {
    let games = [
      "Apex",
      "Valorant",
      "Overwatch",
      "Plateup",
      "Roblox",
      "League",
    ];
    let msg = gameSelect.pickGame(games);
    let embed = new EmbedBuilder()
      .setTitle("Game Selector")
      .setDescription(msg)
      .setColor(embedColors.mainColor);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
