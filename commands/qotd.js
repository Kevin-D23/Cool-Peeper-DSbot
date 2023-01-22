const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const genQuote = require("../commandFunctions/quote");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qotd")
    .setDescription("See the quote of the day"),
  async execute(interaction) {
    let qotd = await genQuote.genQuote();
    let embed = new EmbedBuilder()
      .setTitle("Quote Of The Day")
      .setDescription(qotd)
      .setColor(embedColors.mainColor);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
