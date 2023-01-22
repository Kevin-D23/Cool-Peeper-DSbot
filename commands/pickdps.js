const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gameSelect = require("../commandFunctions/pickGameFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pickdps")
    .setDescription("Pick a random overwatch dps to play"),
  async execute(interaction) {
    let msg = gameSelect.pickHero("dps");
    let embed = new EmbedBuilder()
      .setTitle("Game Selector")
      .setDescription(msg)
      .setColor(embedColors.mainColor);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
