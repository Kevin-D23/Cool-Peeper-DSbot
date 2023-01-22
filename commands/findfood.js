const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const food = require("../commandFunctions/foodFinder.js");
const embedColors = require("../commandFunctions/embedColors.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("findfood")
    .setDescription("Find restaurants near you")
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("Input an address, city, or state")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("price")
        .setDescription("Select price range")
        .setRequired(true)
        .addChoices(
          {
            name: "All",
            value: "0",
          },
          {
            name: "$",
            value: "1",
          },
          {
            name: "$$",
            value: "2",
          },
          {
            name: "$$$",
            value: "3",
          },
          {
            name: "$$$$",
            value: "4",
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Pick categroy of food (ex. food, sushi, pizza)")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("results")
        .setDescription("Number of results you want to show")
        .setRequired(true)
        .setMinValue(0)
    ),
  async execute(interaction) {
    let location = interaction.options.get("location").value;
    let price = interaction.options.get("price").value;
    let category = interaction.options.get("category").value;
    let results = interaction.options.get("results").value;
    let msg = await food.findFood(location, price, category, results);
    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setColor(embedColors.mainColor);

    embed.setDescription(msg);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
