const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gamble = require("../commandFunctions/gamble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your/someone's balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Add user if you would like to check their balance")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    let balance;
    let mentionedUser = interaction.options.get("user");
    let msg;
    let winrate;
    let placement;
    let numUsers = interaction.guild.memberCount;

    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setColor(embedColors.mainColor);

    if (mentionedUser == null) {
      balance = await gamble.getBalance(interaction.user.id);
      winrate = await gamble.winLoss(interaction.user.id);
      placement = await gamble.getPlacement(interaction.user.id);
      msg =
        "You have $" +
        balance +
        "\nWinrate: " +
        winrate +
        "%\nPlacement: " +
        placement +
        "/" +
        numUsers;
    } else {
      balance = await gamble.getBalance(mentionedUser.user.id);
      winrate = await gamble.winLoss(mentionedUser.user.id);
      placement = await gamble.getPlacement(mentionedUser.user.id);
      msg =
        mentionedUser.user.username +
        " has $" +
        balance +
        "\nWinrate: " +
        winrate +
        "%\nPlacement: " +
        placement +
        "/" +
        numUsers;
    }

    embed.setDescription(msg);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
