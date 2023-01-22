const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gamble = require("../commandFunctions/gamble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flipcoin")
    .setDescription("Flip a coin"),
  async execute(interaction) {
    let result = await gamble.coinFlip();
    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setDescription(result)
      .setColor(embedColors.mainColor);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
