const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const embedColors = require("../commandFunctions/embedColors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Check song queue")
    .addNumberOption((option) =>
      option.setName("page").setDescription("Queue page number")
    ),
  async execute(interaction, client) {
    let embed = new EmbedBuilder().setColor(embedColors.mainColor);

    const queue = await client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      embed.setDescription(`**There are no songs in the queue**`);
      return await interaction.reply({ embeds: [embed] });
    }

    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = (interaction.options.getNumber("page") || 1) - 1;

    if (page > totalPages) {
      embed
        .setDescription(`**Invalid page. There are only ${totalPages} pages**`)
        .setColor(embedColors.errorColor);
      return await interaction.reply({ embeds: [embed] });
    }

    const queueString = queue.tracks
      .slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        return `**${page * 10 + i + 1}.** \`[${song.duration}}\` ${
          song.title
        } -- <@${song.requestedBy.id}>`;
      })
      .join("\n");

    const currentSong = queue.current;

    embed
      .setDescription(
        `**Currently Playing**\n` +
          (currentSong
            ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>`
            : "None") +
          `\n\n**Queue**\n${queueString}`
      )
      .setFooter({
        text: `Page ${page + 1} out of ${totalPages}`,
      })
      .setThumbnail(currentSong.thumbnail);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
