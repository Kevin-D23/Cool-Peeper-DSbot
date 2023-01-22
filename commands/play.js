const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const embedColors = require("../commandFunctions/embedColors");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song!")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Enter a link or keywords to search for a song")
    ),
  async execute(interaction, client) {
    let embed = new EmbedBuilder().setColor(embedColors.mainColor);
    if (!interaction.member.voice.channel) {
      embed.setDescription(
        "**You need to be in a voice channel to play a song**"
      );
      embed.setColor(embedColors.errorColor);
      return await interaction.reply({ embeds: [embed] });
    }

    const queue = await client.player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let search = interaction.options.get("song").value;

    const result = await client.player
      .search(search, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .catch((err) => {
        console.log(err);
      });
    if (!result || !result.tracks.length) {
      embed.setDescription("**No results**");
      embed.setColor(embedColors.errorColor);
      return await interaction.reply({ embeds: [embed] });
    }

    if (result.playlist) {
      const playlist = result.tracks;
      queue.addTracks(playlist);
      embed
        .setDescription(
          `**[${playlist[0].playlist.title}](${playlist[0].playlist.url})**`
        )
        .setThumbnail(playlist[0].thumbnail)
        .setFooter({
          text: `Added by ${interaction.user.username}`,
          iconURL: interaction.user.avatarURL(),
        });
    } else {
      const song = result.tracks[0];
      queue.addTrack(song);
      embed
        .setDescription(`**[${song.title}](${song.url})**`)
        .setThumbnail(song.thumbnail)
        .setFooter({
          text: `Added by ${interaction.user.username}`,
          iconURL: interaction.user.avatarURL(),
        });
    }

    if (!queue.playing) await queue.play();

    await interaction.reply({ embeds: [embed] });
  },
};
