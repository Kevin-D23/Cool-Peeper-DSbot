const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the music"),
  async execute(interaction, client) {
    let embed = new EmbedBuilder().setColor(embedColors.mainColor);
    const queue = await client.player.getQueue(interaction.guildId);

    if (!queue) {
      embed
        .setColor(embedColors.errorColor)
        .setDescription("**There are no songs in the queue**");
      return await interaction.reply({ embeds: [embed] });
    }

    queue.setPaused(true);
    embed.setDescription(
      "**Music has been paused.** Use '/resume' to resume the music."
    );
    await interaction.reply({ embeds: [embed] });
  },
};
