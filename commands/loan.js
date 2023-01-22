const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gamble = require("../commandFunctions/gamble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loan")
    .setDescription(
      "Loan a friend some money to fullfill their filthy gambling needs"
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Loan amount")
        .setMinValue(1)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let user = interaction.options.get("user").user.id;
    let amount = interaction.options.get("amount").value;
    let msg = "";
    if (await gamble.hasFunds(interaction.user.id, amount)) {
      await gamble.updateBalance(interaction.user.id, 0 - amount);
      await gamble.updateBalance(user, amount);
      msg =
        `<@${interaction.user.id}>` +
        " -->  $" +
        amount +
        "  --> " +
        `<@${user}>` +
        "\n\nTransfer completed";
    } else msg = "Insufficient funds";

    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setDescription(msg)
      .setColor(embedColors.mainColor);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
