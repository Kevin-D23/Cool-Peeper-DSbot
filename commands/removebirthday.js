const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const birthday = require("../commandFunctions/birthday");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removebirthday")
    .setDescription("Remove your birthday from the database"),
  async execute(interaction) {
    let msg = await birthday.removeBirthday(interaction.user.id);
    let embed = new EmbedBuilder()
      .setTitle("Birthday Bot")
      .setDescription(msg)
      .setColor(embedColors.mainColor);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
