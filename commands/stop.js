const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playing songs"),
  async execute(interaction, client) {
    let embed = new EmbedBuilder().setColor(embedColors.mainColor);
    const queue = await client.player.getQueue(interaction.guildId);

    if (!queue) {
      embed.setDescription("**There are no songs in the queue**");
      return await interaction.reply({ embeds: [embed] });
    }

    queue.destroy();
    embed.setDescription("**Music stopped**");

    await interaction.reply({ embeds: [embed] });
  },
};
