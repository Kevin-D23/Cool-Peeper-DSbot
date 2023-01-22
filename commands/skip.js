const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");

module.exports = {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip a song"),
  async execute(interaction, client) {
    let embed = new EmbedBuilder().setColor(embedColors.mainColor);
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      embed
        .setDescription("There are no songs in the queue.")
        .setColor(embedColors.errorColor);
      return await interaction.reply({ embeds: [embed] });
    }

    const currentSong = queue.current;

    queue.skip();
    embed
      .setDescription(
        `**[${currentSong.title}](${currentSong.url}) has been skipped!**`
      )
      .setThumbnail(currentSong.thumbnail)
      .setFooter({
        text: `Added by ${currentSong.requestedBy.username}`,
        iconURL: `${currentSong.requestedBy.avatarURL()}`,
      });

    await interaction.reply({ embeds: [embed] });
  },
};
