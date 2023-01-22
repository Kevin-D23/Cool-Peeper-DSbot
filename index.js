require("dotenv/config");
const path = require("node:path");
const fs = require("node:fs");
const {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  EmbedBuilder,
  Embed,
  Partials,
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const birthday = require("./commandFunctions/birthday.js");
const gamble = require("./commandFunctions/gamble.js");
const flipOffPlayer = require("./commandFunctions/flipOffPlayer");
const BirthdayObj = require("./models/birthdayModel");
const GambleObj = require("./models/gambleModel");
const mongoose = require("mongoose");
const embedColors = require("./commandFunctions/embedColors");
const { Player, QueryType } = require("discord-player");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel],
});

// Music player
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

// Output each song played
client.player.on("trackStart", (queue, track) => {
  let embed = new EmbedBuilder()
    .setColor(embedColors.mainColor)
    .setDescription(`🎶 | Now playing **[${track.title}](${track.url})**!`)
    .setThumbnail(track.thumbnail)
    .setFooter({
      text: `Added by ${track.requestedBy.username}`,
      iconURL: `${track.requestedBy.avatarURL()}`,
    })
    .setTitle("**Now Playing**");
  queue.metadata.channel.send({ embeds: [embed] });
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    status: "dnd",
    activities: [{ name: "with myself" }],
  });
  // main();
  // test();
  setInterval(() => birthday.checkBirthdayDaily(client), 60000);
  setInterval(() => gamble.dailyMoney(), 60000);
  setInterval(() => flipOffPlayer.flipOffPlayer(client), 60000);
});

// COMMAND HANDLER
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute in command") {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.log(error);
    await interaction.reply({
      content: `**There was an error while executing this command!**`,
      ephemeral: true,
    });
  }
});

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// ELLO
client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase().includes("ello")) {
    if (message.author.id != client.user.id) message.channel.send("ELLO");
  }
  // dm to general chat
  else if (message.guildId == null && message.author.id !== client.user.id) {
    if (message.author.id === process.env.bossmanID) {
      const channelName =
        message.content[0].toLowerCase() + message.content[1].toLowerCase();
      const msg = message.content.slice(3);
      let channel;
      if (channelName === "gn")
        channel = await client.channels.fetch(process.env.generalID);
      else if (channelName === "ca")
        channel = await client.channels.fetch(process.env.coolPeepID);
      else if (channelName === "cp")
        channel = await client.channels.fetch(process.env.coolPeeperID);
      channel.send(msg);
    }
  }
});

// adds player to gamble database
client.on("guildMemberAdd", (member) => {
  gamble.addPlayer(member.user.id);

  var channel = member.guild.channels.cache.get(process.env.welcomeID);

  channel.send({
    content: `Hello, <@${member.id}>\n`,
  });
});

// remove player from gamble database when they leave
client.on("guildMemberRemove", (member) => {
  gamble.removePlayer(member.user.id);
  var channel = member.guild.channels.cache.get(process.env.coolPeepID);
  channel.send(`Goodbye, <@${member.user.id}>`);
});

client.login(process.env.TOKEN);
