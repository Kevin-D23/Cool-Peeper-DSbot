require('dotenv/config')
const { Client, GatewayIntentBits, ActionRowBuilder, SelectMenuBuilder, InteractionCollector, Events} = require('discord.js');
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

  setInterval(checkBirthday, 60000);
});

// PING PONG
client.on("messageCreate", (message) => {
  if(message.content.toLowerCase() === "ping"){
    message.channel.send('pong')
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
client.on("messageCreate", async (message) => {
  if(message.content.toLowerCase() === "!addbirthday"){
    const result = await birthday.doesExist(message.author.id)
    if(result != null){
      message.channel.send("Birthday is already in databse")
    }
    else {
      const filter = (m) => message.author.id === m.author.id;
      month = Number;
      day = Number;
      userId = message.author.id

      // Get players birth month
      message.reply("What month is your birthday (1-12)?")
      message.channel.awaitMessages({filter, max: 1, time: 10000, errors: ["time"]})
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
            message.channel.awaitMessages({filter, max: 1, time: 10000, errors: ["time"]})
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
                message.channel.send("Error: Timed out")
              })
            }
            else 
              message.channel.send("Error: Invalid input")
        })
        .catch((err) =>{
          console.log(err)
          message.channel.send("Error: Timed out")
        })
        setTimeout(async () => {
          const channel = await client.channels.fetch('689184769677983774')
          var user = await birthday.checkBirthday()

          if(user != null){
            channel.send({content: `Happy Birthday, <@${user}>!`})
          }
        },7000)
      

    }
  }
})

// REMOVE BIRTHDAY
client.on("messageCreate", async (message) => {
  if(message.content.toLowerCase() === '!removebirthday') {
    message.channel.send(await birthday.removeBirthday(message.author.id))
  }
})

// FIND BIRTHDAY
client.on("messageCreate", async (message) => {
  let msg = message.content.toLowerCase()
  if(msg.substring(0,13) === '!findbirthday') {
  let mentionedUser = message.mentions.users.first().id

    if (!mentionedUser) {
      message.reply('Please type command followed by @ (i.e. !findbirthday @playerName)')
    } 
    else {
      message.reply(await birthday.findBirthday(mentionedUser))
    }
  }
})

// CHECK BIRTHDAY
async function checkBirthday() {
  var date = new Date()
  if(date.getHours() === 7 && date.getMinutes() === 0){
    const channel = await client.channels.fetch('689184769677983774')
    var user = await birthday.checkBirthday()
    
    if(user != null){
      channel.send({content: `Happy Birthday, <@${user}>!`})
    }
  }
}


// PICK GAME 
client.on("messageCreate", (message) => {
  if(message.content.toLowerCase() === '!pickgame'){
    let games = ['Apex', 'Valorant', 'Overwatch', 'Plateup', 'Devour']

    message.reply(gameSelect.pickGame(games))
    }
  })


  // role selector
  client.on("guildMemberAdd", (member) => {
   var channelID = "689184769677983774"
   var channel = member.guild.channels.cache.get(channelID);

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

    channel.send(({content: `Welcome to the server <@${member.id}>\n`, components: [new ActionRowBuilder().setComponents(roleSelector)]}));

});


// role selector when clicked
client.on(Events.InteractionCreate, (interaction) => {
  if(interaction.isSelectMenu())
  {
    const angeliaID = '733893079786061826'
    const kevinID = '806625249009336391'
    const brianID = '760685888665026563'
    const alexId = '737099202282258544'
    if(interaction.customId === 'roles')
      for(let i = 0; i < interaction.values.length;i++){
        if(interaction.values[i] === 'angela'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === angeliaID){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(angeliaID)
          }
        }
        else if(interaction.values[i] === 'kevin'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === kevinID){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(kevinID)
          }
        }
        else if(interaction.values[i] === 'brian'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === brianID){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(brianID)
          }
        }
        else if(interaction.values[i] === 'alex'){
          let hasRole = false;
          for(let i = 0; i < interaction.member._roles.length; i++)
          {
            if(interaction.member._roles[i] === alexId){
              hasRole = true;
              break;
            }
          }
          if(hasRole === false){
            interaction.member.roles.add(alexId)
          }
        }
      }
      interaction.editReply('Role(s) selected')
  }
})

client.login(process.env.TOKEN)

