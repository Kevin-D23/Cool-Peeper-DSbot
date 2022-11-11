require('dotenv/config')
const { Client, GatewayIntentBits, ActionRowBuilder, SelectMenuBuilder, InteractionCollector, Events, Routes} = require('discord.js');
const {REST} = require('@discordjs/rest')
const birthday = require('./commands/birthday.js')
const gameSelect = require('./commands/pickGame.js')
const BirthdayObj = require('./models/birthdayModel')
const mongoose = require('mongoose')

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ] 
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({status: 'dnd', activities: [{name:  "with myself"}]})
  main();
  setInterval(checkBirthday, 60000);
});

const commands = [
    {
      name: 'ping',
      description: 'Replies with pong'
    },
    {
      name: 'pickgame',
      description: 'Pick random game to play',
    },
    {
      name: 'addbirthday',
      description: 'Add your birthday to the database',
    },
    {
      name: 'removebirthday', 
      description: 'Remove your birthday from the database'
    },
    {
      name: 'findbirthday',
      description: 'Find the date of someones birthday'
    },
    {
      name: 'commands',
      description: 'Display list of commands'
    }
  ]

const rest = new REST({version: '10'}).setToken(process.env.TOKEN)


async function main() {
  try {
    await rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID), {
      body: commands,
    }) 
  } catch(err) {
    console.log(err)
  }
}


// PING PONG
client.on("interactionCreate", (interaction) => {
  if(interaction.isChatInputCommand()){
    if(interaction.commandName === 'ping')
       interaction.reply('pong')
  }
})

// ELLO
client.on("messageCreate", (message) => {
  if(message.content.toLowerCase().includes("ello")) {
    if(message.author.id != client.user.id)
      message.channel.send("ELLO")
  }
})

// ADD BIRTHDAY
client.on("interactionCreate", async (interaction) => {
  if(interaction.isChatInputCommand()){
    if(interaction.commandName === 'addbirthday'){
      const result = await birthday.doesExist(interaction.user.id)
      if(result != null){
        interaction.reply("Birthday is already in database")
      }
      else {
        month = Number;
        day = Number;
        userId = interaction.user.id

        const filter = (m) => interaction.user.id === m.author.id;

        // Get players birth month
        interaction.reply("What month is your birthday (1-12)?")
        interaction.channel.awaitMessages({filter, max: 1, time: 10000, errors: ["time"]})
          .then((collected) => {
            month = Math.floor(collected.first().content)

            // Get players birth day depending on month
            if(month > 0  && month <= 12){
              if(month === 2){
                collected.first().reply("What day were you born on (1-28)")
              }
              else if (month === 4 || month === 6 || month === 9 || month === 11){
                collected.first().reply("What day were you born on (1-30)")
              }
              else 
              collected.first().reply("What day were you born on (1-31)")

              // Check if birth day is valid with corresponding month
              interaction.channel.awaitMessages({filter, max: 1, time: 10000, errors: ["time"]})
                .then(async (collected) => {
                  day = Math.floor(collected.first().content)
                  if(day > 0 && day <= 31){
                    if(month === 2){
                      if(day > 0 && day <=28)
                        collected.first().reply(birthday.addBirthday(userId, month, day));
                      else 
                      collected.first().reply("Error: Invalid input")
                    }
                    if(month === 4 || month === 6 || month === 9 || month === 11) {
                      if (day > 0 && day <= 30)
                      collected.first().reply(birthday.addBirthday(userId, month, day))
                      else 
                      collected.first().reply("Error: Invalid input")
                    }
                    if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month == 10 || month == 12) {
                      collected.first().reply(birthday.addBirthday(userId, month, day))
                    }
                  }
                  else 
                  collected.first().reply("Error: Invalid input")
                })
                .catch((err) =>{
                  console.log(err)
                  interaction.channel.send("Error: Timed out")
                })
              }
              else 
                interaction.channel.send("Error: Invalid input")
          })
          .catch((err) =>{
            console.log(err)
            interaction.channel.send("Error: Timed out")
          })
          setTimeout(async () => {
            const channel = await client.channels.fetch(process.env.generalID)
            var user = await birthday.checkBirthday()

            if(user != null){
              channel.send({content: `Happy Birthday, <@${user}>!`})
            }
          },7000)
      }
    }
  }
})

// REMOVE BIRTHDAY
client.on("interactionCreate", async (interaction) => {
  if(interaction.isChatInputCommand()) {
    if(interaction.commandName === 'removebirthday')
    {
      interaction.reply(await birthday.removeBirthday(interaction.user.id))
    }
  }
})

// FIND BIRTHDAY
client.on("interactionCreate", (interaction) => {
  if(interaction.isChatInputCommand()) {
    if(interaction.commandName === 'findbirthday') {
      interaction.reply("Whos birthday would you like to find? (@username)")

      const filter = (m) => interaction.user.id === m.author.id;

      interaction.channel.awaitMessages({filter, max: 1, time: 10000, errors: ["time"]})
        .then (async (collected) => {
          let mentionedUser = collected.first().mentions.users.first()

          if(!mentionedUser) {
            interaction.channel.send("Invalid input")
          }
          else{
            let msg = await birthday.findBirthday(mentionedUser)
            collected.first().reply(msg)
          }
        })
        .catch((err) =>{
          console.log(err)
          interaction.channel.send("Error: Timed out")
        })
      }
  }
})

// CHECK BIRTHDAY
async function checkBirthday() {
  var date = new Date()
  if(date.getHours() === 7 && date.getMinutes() === 0){
    const channel = await client.channels.fetch(process.env.generalID)
    var user = await birthday.checkBirthday()
    
    if(user != null){
      channel.send({content: `Happy Birthday, <@${user}>!`})
    }
  }
}


// PICK GAME 
client.on('interactionCreate', (interaction) => {
  if(interaction.isChatInputCommand()){
    if(interaction.commandName  === 'pickgame') {
      let games = ['Apex', 'Valorant', 'Overwatch', 'Plateup', 'Devour', 'Roblox']

      interaction.reply({content: gameSelect.pickGame(games)})
      }
    }
  })


  // role selector
  client.on("guildMemberAdd", (member) => {
    selectRole(member);
});


function selectRole(member){
  var channel = member.guild.channels.cache.get(process.env.welcomeID);

   const roleSelector = new SelectMenuBuilder()
       .setCustomId("roles")
       .setPlaceholder("Please select your roles")
       .setMinValues(0)
       .setMaxValues(4)
       .setOptions([
         { label: `Angie's Peeps`, value: 'angela'},
         { label: `Kevin's Peeps`, value: 'kevin'},
         { label: `Brian's Peeps`, value: 'brian'},
         { label: `Alex's Peeps` , value: 'alex'}
       ]);
   channel.send(({content: `Hello, <@${member.id}>\n`, components: [new ActionRowBuilder().setComponents(roleSelector)]}));
}

 // role selector when clicked
 client.on(Events.InteractionCreate, async (interaction) => {
  if(interaction.isSelectMenu())
  {
    if(interaction.customId === 'roles')
      for(let i = 0; i < interaction.values.length;i++){
        if(interaction.values[i] === 'angela'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === process.env.angelaID){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(process.env.angelaID)
          }
        }
        else if(interaction.values[i] === 'kevin'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === process.env.kevinID){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(process.env.kevinID)
          }
        }
        else if(interaction.values[i] === 'brian'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === process.env.brianID){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(process.env.brianID)
          }
        }
        else if(interaction.values[i] === 'alex'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === process.env.alexId){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(process.env.alexId)
          }
        }
      }
      await interaction.update({content: 'Role(s) Selected', components: [] })
  }
})


// show available bot commands
client.on("interactionCreate", (interaction) => {
  if(interaction.isChatInputCommand) {
    if(interaction.commandName === 'commands') {
      let msg = ""
      for(let i = 0; i < commands.length; i++){
        msg += commands[i].name + "\n"
      }
      interaction.reply(msg)
    }
  }
})

client.login(process.env.TOKEN)

