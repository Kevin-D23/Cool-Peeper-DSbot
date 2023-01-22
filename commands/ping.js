const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .addNumberOption((option) => option.setName("test").setDescription("test")),
  async execute(interaction) {
    let embed = new EmbedBuilder()
      .setDescription("Pong")
      .setColor(embedColors.mainColor);

    await interaction.reply({ embeds: [embed] });
  },
};
