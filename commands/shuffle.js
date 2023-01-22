const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the song queue"),
  async execute(interaction, client) {
    let embed = new EmbedBuilder().setColor(embedColors.mainColor);
    const queue = await client.player.getQueue(interaction.guildId);

    if (!queue) {
      embed.setDescription("**There are no songs in the queue**");
      return await interaction.reply({ embeds: [embed] });
    }

    queue.shuffle();
    embed.setDescription(
      `**Queue of ${queue.tracks.length} songs has been shuffled**`
    );
    await interaction.reply({ embeds: [embed] });
  },
};
