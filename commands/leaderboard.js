const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gamble = require("../commandFunctions/gamble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Check the peep casino leaderboard"),
  async execute(interaction) {
    let usersTop = await gamble.leaderboardTopUsers();
    let balancesTop = await gamble.leaderboardTopMoney();
    let usersBot = await gamble.leaderboardBotUsers();
    let balancesBot = await gamble.leaderboardBotMoney();
    let numUsers = interaction.guild.memberCount;
    let msg = "";
    let currentUser;
    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setColor(embedColors.mainColor);

    for (i = 0; i < usersTop.length; i++) {
      currentUser = await interaction.guild.members.fetch(usersTop[i]);
      msg +=
        i +
        1 +
        ". " +
        currentUser.user.username +
        "  -->  $" +
        balancesTop[i] +
        "\n";
    }

    msg += ".\n.\nWall of Shame:\n";

    for (i = usersBot.length - 1, j = numUsers - 4; i >= 0; i--, j++) {
      currentUser = await interaction.guild.members.fetch(usersBot[i]);
      msg +=
        j +
        ". " +
        currentUser.user.username +
        "  -->  $" +
        balancesBot[i] +
        "\n";
    }

    embed.setDescription(msg);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
