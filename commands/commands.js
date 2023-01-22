const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Display list of commands"),
  async execute(interaction) {
    let msg = "";
    fs.readdirSync("./commands").forEach((file) => {
      msg += `/` + file.slice(0, -3) + "\n";
    });

    let embed = new EmbedBuilder()
      .setTitle("Command List")
      .setDescription(msg)
      .setColor(embedColors.mainColor);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
