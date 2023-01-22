const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gamble = require("../commandFunctions/gamble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("collectdaily")
    .setDescription("Collect your daily $200"),
  async execute(interaction) {
    let result = await gamble.collectDaily(interaction.user.id);
    let msg = "";
    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setColor(embedColors.mainColor);

    if (result) {
      msg = "Daily collected";
    } else {
      msg = "Daily has already been collected";
      embed.setColor(embedColors.errorColor);
    }

    embed.setDescription(msg);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
