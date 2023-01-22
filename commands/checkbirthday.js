const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const birthday = require("../commandFunctions/birthday");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("findbirthday")
    .setDescription("Find someone's birthday from the database")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  async execute(interaction) {
    let mentionedUser = interaction.options.get("user").user.id;
    let msg = await birthday.findBirthday(mentionedUser);
    let embed = new EmbedBuilder()
      .setTitle("Birthday Bot")
      .setDescription(msg)
      .setColor(embedColors.mainColor);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
