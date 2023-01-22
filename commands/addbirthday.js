const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const birthday = require("../commandFunctions/birthday");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addbirthday")
    .setDescription("Add your birthday to the database")
    .addNumberOption((option) =>
      option
        .setName("month")
        .setDescription("Enter birth month")
        .setMinValue(1)
        .setMaxValue(12)
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("day")
        .setDescription("Enter birth day")
        .setMinValue(1)
        .setMaxValue(31)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const result = await birthday.doesExist(interaction.user.id);
    let embed = new EmbedBuilder()
      .setTitle("Birthday Bot")
      .setColor(embedColors.mainColor);

    if (result != null) {
      embed.setDescription("Birthday is already in database");
      await interaction.reply({
        embeds: [embed],
      });
    } else {
      let userId = interaction.user.id;
      let month = interaction.options.get("month").value;
      let day = interaction.options.get("day").value;
      let msg = "";

      if (month === 2 && day > 28) {
        embed.setDescription("Invalid birthday");
        await interaction.reply({
          embeds: [embed],
        });
      } else if (
        (month === 4 || month === 6 || month === 9 || month === 11) &&
        day > 30
      ) {
        embed.setDescription("Invalid birthday");
        await interaction.reply({
          embeds: [embed],
        });
      } else {
        msg = birthday.addBirthday(userId, month, day);
        embed.setDescription(msg);
        await interaction.reply({
          embeds: [embed],
        });
      }

      setTimeout(async () => {
        const channel = await client.channels.fetch(process.env.generalID);
        var user = await birthday.checkBirthday();

        if (user != null) {
          channel.send({ content: `Happy Birthday, <@${user}>!` });
        }
      }, 7000);
    }
  },
};
