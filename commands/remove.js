const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a song from the queue")
    .addNumberOption((option) =>
      option
        .setName("number")
        .setDescription("Select queue number to remove")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let embed = new EmbedBuilder().setColor(embedColors.mainColor);
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      embed
        .setDescription("There are no songs in the queue.")
        .setColor(embedColors.errorColor);
      return await interaction.reply({ embeds: [embed] });
    }

    const pickedSong =
      queue.tracks[interaction.options.get("number").value - 1];

    embed
      .setDescription(
        `[${pickedSong.title}](${pickedSong.url}) removed from queue`
      )
      .setThumbnail(pickedSong.thumbnail);

    await interaction.reply({ embeds: [embed] });

    queue.remove(interaction.options.get("number").value - 1);
    //   }
  },
};
