const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");
const gamble = require("../commandFunctions/gamble");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Bet on a coinflip")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Bet amount")
        .setRequired(true)
        .setMinValue(1)
    )
    .addStringOption((option) =>
      option
        .setName("guess")
        .setDescription("Guess heads or tails")
        .setRequired(true)
        .addChoices(
          {
            name: "Heads",
            value: "heads",
          },
          {
            name: "Tails",
            value: "tails",
          }
        )
    ),
  async execute(interaction) {
    const winMsg = [
      "AYYY GOOD SHIT",
      "LETS GOOOOO",
      "You win!",
      "You got lucky this time",
      "FUCK YEA",
      "YIPPEEEE",
      "YESSIRRR",
    ];
    const loseMsg = [
      "BHAAHAHAH YOU SUCK",
      "Good luck next time loser",
      "Save yo money next time",
      "Why are you still playing",
      "How tf you get that wrong",
      "BROOOO UR ASS",
    ];
    let msg = "";
    let embed = new EmbedBuilder()
      .setTitle("Peep Casino")
      .setColor(embedColors.mainColor);
    if (
      (await gamble.hasFunds(
        interaction.user.id,
        interaction.options.get("bet").value
      )) === true
    ) {
      let result = await gamble.coinFlip();
      if (interaction.options.get("guess").value === result) {
        embed.setColor("#2ECC71");
        gamble.winLoss(interaction.user.id, "win");
        let win = winMsg[Math.floor(Math.random() * winMsg.length)];
        let newBalance = await gamble.updateBalance(
          interaction.user.id,
          interaction.options.get("bet").value
        );
        msg =
          "Bet: $" +
          interaction.options.get("bet").value +
          "\nGuess: " +
          interaction.options.get("guess").value +
          "\nResult: " +
          result +
          "\n\n" +
          win +
          "\nNew balance: $" +
          newBalance;
      } else {
        embed.setColor(embedColors.errorColor);
        gamble.winLoss(interaction.user.id, "lose");
        let lose = loseMsg[Math.floor(Math.random() * loseMsg.length)];
        let newBalance = await gamble.updateBalance(
          interaction.user.id,
          0 - interaction.options.get("bet").value
        );
        msg =
          "Bet: $" +
          interaction.options.get("bet").value +
          "\nGuess: " +
          interaction.options.get("guess").value +
          "\nResult: " +
          result +
          "\n\n" +
          lose +
          "\nNew balance: $" +
          newBalance;
      }
    } else {
      msg = "Insufficient funds";
      embed.setColor(embedColors.errorColor);
    }
    embed.setDescription(msg);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
