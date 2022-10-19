require('dotenv/config')
const { Client, GatewayIntentBits} = require('discord.js');
const birthday = require('./birthday.js')
const gameSelect = require('./pickGame.js')
const BirthdayObj = require('./models/birthdayModel')
const mongoose = require('mongoose')

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// PING PONG
client.on("messageCreate", (message) => {
  if(message.content.toLowerCase() === "ping"){
    message.channel.send('pong')
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
              .then((collected) => {
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


// PICK GAME 
client.on("messageCreate", (message) => {
  if(message.content.toLowerCase() === '!pickgame'){
    let games = ['Apex', 'Valorant', 'Overwatch', 'Plateup', 'Devour']

    message.reply(gameSelect.pickGame(games))
    }
  })


client.login(process.env.TOKEN)
