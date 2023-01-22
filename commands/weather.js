const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const genWeather = require("../commandFunctions/genWeather");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Check the current weather in any city")
    .addNumberOption((option) =>
      option.setName("zip").setDescription("zip code").setRequired(true)
    ),
  async execute(interaction) {
    weather = await genWeather.genWeather(interaction.options.get("zip").value);
    let embed = new EmbedBuilder()
      .setTitle("Weather: " + interaction.options.get("zip").value)
      .setDescription(weather)
      .setColor(embedColors.mainColor);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
