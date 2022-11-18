require('dotenv/config')
const { Client, GatewayIntentBits, ActionRowBuilder, SelectMenuBuilder, InteractionCollector, Events, Routes, EmbedBuilder, Embed, Partials, PartialTextBasedChannel} = require('discord.js');
const {REST} = require('@discordjs/rest')
const birthday = require('./commands/birthday.js')
const gamble = require('./commands/gamble.js')
const gameSelect = require('./commands/pickGame.js')
const BirthdayObj = require('./models/birthdayModel')
const GambleObj = require('./models/gambleModel')
const mongoose = require('mongoose')
const qotdURL = "https://zenquotes.io/api/today/"
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?zip="


const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages
  ] ,
  partials: [
    Partials.Message,
    Partials.Channel
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({status: 'dnd', activities: [{name:  "with myself"}]})
  main();
  test()
  setInterval(genQuote, 60000)
  setInterval(checkBirthday, 60000);
  setInterval(dailyMoney, 60000)
});

var qotd = ''

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
      options: [
        {
          name: 'month',
          description: 'Enter birth month',
          type: 4,
          min_value: 1,
          max_value: 12,
          required: true,
        },
        {
          name: 'day',
          description: 'Enter birth day',
          type: 4,
          min_value: 1,
          max_value: 31,
          required: true,
        }
      ]
    },
    {
      name: 'removebirthday', 
      description: 'Remove your birthday from the database'
    },
    {
      name: 'findbirthday',
      description: 'Find the date of someones birthday',
      options: [
        {
          name: 'user',
          description: 'Select a user',
          type: 6,
          required: true
        }
      ]
    },
    {
      name: 'commands',
      description: 'Display list of commands'
    },
    {
      name: 'qotd',
      description: 'Display the quote of the day'
    },
    {
      name: 'weather',
      description: 'Check the current weather in any city',
      options: [
        {
          name: 'zip',
          description: 'Zip code',
          type: 10,
          required: true
        }
      ]
    },
    {
      name: 'flipcoin',
      description: 'Flip a coin'
    },
    {
      name: 'picktank',
      description: 'Selects a random Overwatch tank'
    },
    {
      name: 'pickdps',
      description: 'Selects a random Overwatch dps'
    },
    {
      name: 'picksupport',
      description: 'Selects a random Overwatch support'
    },
    {
      name: 'gamble',
      description: 'Bet on a coin flip',
      options: [
        {
          name: 'bet',
          description: 'Bet amount',
          type: 4,
          min_value: 0,
          required: true
        }, 
        {
          name: 'guess',
          description: 'Guess heads or tails',
          type: 3,
          required: true,
          choices: [
            {
              name: 'Heads',
              value: 'heads'
            },
            {
              name: 'Tails',
              value: 'tails'
            }
          ]
        }
      ]
    },
    {
      name: 'balance',
      description: 'Check how much money you have',
      options: [
        {
          name: 'user',
          description: 'Add user if you would like to check their balance',
          type: 6,
          required: false
        }
      ]
    },
    {
      name: 'loan', 
      description: 'Loan a friend some money to fullfill their filthy gambling needs',
      options: [
        {
          name: 'user',
          description: 'Select a user',
          type: 6,
          required: true
        },
        {
          name: 'amount',
          description: 'Loan amount',
          type: 4,
          min_value: 0,
          required: true
        }
      ]
    },
    {
      name: 'coinstats',
      description: 'Check stats of all coin flips'
    },
    {
      name: 'leaderboard',
      description: 'Check the casino\'s top 5'
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

async function test() {
  try {
    await rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.testServerID), {
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
client.on('messageCreate', async (message) => {
  if(message.content.toLowerCase().includes("ello")) {
    if(message.author.id != client.user.id)
      message.channel.send("ELLO")
  }
    // dm to general chat
    else if(message.guildId == null && message.author.id !== client.user.id) {
      if(message.author.id === process.env.bossmanID) {
        const channelName = message.content[0].toLowerCase() + message.content[1].toLowerCase()
        const msg = message.content.slice(3)
        let channel
        if(channelName === 'gn') 
          channel = await client.channels.fetch(process.env.generalID)
        else if(channelName === 'ca')
          channel = await client.channels.fetch(process.env.coolPeepID)
        else if(channelName === 'cp')
          channel = await client.channels.fetch(process.env.coolPeeperID)
        channel.send(msg)
      }
    }
    
})

// ADD BIRTHDAY
client.on("interactionCreate", async (interaction) => {
  if(interaction.isChatInputCommand()){
    if(interaction.commandName === 'addbirthday'){
      const result = await birthday.doesExist(interaction.user.id)
      let embed = new EmbedBuilder()
        .setTitle('Birthday Bot')
        .setColor('#3498DB')

      if(result != null){
        embed.setDescription("Birthday is already in database")
        await interaction.reply({
          embeds : [embed]
        })
      }
      else {
        let userId = interaction.user.id
        let month = interaction.options.get('month').value
        let day = interaction.options.get('day').value
        let msg = ""
      
        if(month === 2 && day > 28){
          embed.setDescription('Invalid birthday')
          await interaction.reply({
            embeds : [embed]
          })
        }
        else if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30){
          embed.setDescription('Invalid birthday')
          await interaction.reply({
            embeds : [embed]
          })
        }
        else {
           msg = birthday.addBirthday(userId, month, day)
           embed.setDescription(msg)
           await interaction.reply({
            embeds : [embed]
          })
        }

          setTimeout(async () => {
            const channel = await client.channels.fetch(process.env.generalID)
            var user = await birthday.checkBirthday()

            if(user != null){
              channel.send({content: `Happy Birthday, <@${user}>!`})
            }
          },7000)
      }
    }
    // REMOVE BIRTHDAY
    else if(interaction.commandName === 'removebirthday')
    {
      let msg = await birthday.removeBirthday(interaction.user.id)
      let embed = new EmbedBuilder()
        .setTitle('Birthday Bot')
        .setDescription(msg)
        .setColor('#3498DB')
        await interaction.reply({
          embeds : [embed]
        })
    }
    // FIND BIRTHDAY
    else if(interaction.commandName === 'findbirthday') {
          let mentionedUser = interaction.options.get('user').user.id
          let msg = await birthday.findBirthday(mentionedUser)
          let embed = new EmbedBuilder()
        .setTitle('Birthday Bot')
        .setDescription(msg)
        .setColor('#3498DB')
        await interaction.reply({
          embeds : [embed]
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
client.on('interactionCreate', async (interaction) => {
  if(interaction.isChatInputCommand()){
    if(interaction.commandName  === 'pickgame') {
      let games = ['Apex', 'Valorant', 'Overwatch', 'Plateup', 'Devour', 'Roblox']
      let msg= gameSelect.pickGame(games)
      let embed = new EmbedBuilder()
        .setTitle('Game Selector')
        .setDescription(msg)
        .setColor('#3498DB')
        await interaction.reply({
          embeds : [embed]
        })
      }
      // PICK TANK
      else if(interaction.commandName === 'picktank') {
        let msg = gameSelect.pickHero('tank')
        let embed = new EmbedBuilder()
        .setTitle('Birthday Bot')
        .setDescription(msg)
        .setColor('#3498DB')
        await interaction.reply({
          embeds : [embed]
        })
      }
      // PICK DPS
      else if(interaction.commandName === 'pickdps') {
        let msg = gameSelect.pickHero('dps')
        let embed = new EmbedBuilder()
        .setTitle('Birthday Bot')
        .setDescription(msg)
        .setColor('#3498DB')
        await interaction.reply({
          embeds : [embed]
        })
      }
      // PICK SUPPORT
      else if(interaction.commandName === 'picksupport') {
        let msg = gameSelect.pickHero('support')
        let embed = new EmbedBuilder()
        .setTitle('Birthday Bot')
        .setDescription(msg)
        .setColor('#3498DB')
        await interaction.reply({
          embeds : [embed]
        })
      }
    }
  })


  // role selector and adds player to gamble database
  client.on("guildMemberAdd", (member) => {
    selectRole(member);

    gamble.addPlayer(member.user.id)
});


// remove player from gamble database when they leave
client.on('guildMemberRemove', (member) => {
  gamble.removePlayer(member.user.id)
})


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
client.on("interactionCreate", async (interaction) => {
  if(interaction.isChatInputCommand) {
    if(interaction.commandName === 'commands') {
      let msg = ""
      for(let i = 0; i < commands.length; i++){
        msg += commands[i].name + "\n"
      }
      let embed = new EmbedBuilder()
        .setTitle('Command List')
        .setDescription(msg)
        .setColor('#3498DB')

        await interaction.reply({
          embeds : [embed]
        })
    }
  }
})


// generate quote of the day
async function genQuote() {
  var date = new Date()
  if(date.getHours() === 0) {
    const response = await fetch(qotdURL)
    var data = await response.json();
    qotd = '"' + data[0].q + '" - ' + data[0].a 
  }
  else if(qotd === ''){
    const response = await fetch(qotdURL)
    var data = await response.json();
    qotd = '"' + data[0].q + '" - ' + data[0].a 
  }
}


// Display quote of the day
client.on("interactionCreate", async (interaction) => {
  if(interaction.isChatInputCommand()) {
    if(interaction.commandName === 'qotd') {
      let embed = new EmbedBuilder()
        .setTitle('Quote Of The Day')
        .setDescription(qotd)
        .setColor('#3498DB')

        await interaction.reply({
          embeds : [embed]
        })
    }
  }
})

// generate weather at desired zip code
async function genWeather(zip) {
  let weather = ""
  const response = await fetch(weatherURL + zip + process.env.weatherID)
    var data = await response.json();
    if(data.cod === '400')
      weather = "Invalid zip code"
    else if(data.cod === '404')
      weather = "City not found"
    else {
      weather = "Weather for " + data.name + "\n\nTemp: " +  Math.round(data.main.temp) + "°F\nHigh/Low: " + Math.round(data.main.temp_max) + "°F/" + Math.round(data.main.temp_min) + "°F\nHumidity: " + Math.round(data.main.humidity) + "%\nWind: " + Math.round(data.wind.speed) + "mph"
    }
    return weather
}

// display weather
client.on('interactionCreate', async (interaction) => {
  if(interaction.isChatInputCommand()) {
    if(interaction.commandName === 'weather') {
      weather = await genWeather(interaction.options.get('zip').value)
      let embed = new EmbedBuilder()
      .setTitle('Weather: ' + interaction.options.get('zip').value) 
      .setDescription(weather)
      .setColor('#3498DB')
      await interaction.reply({
        embeds: [embed]
      })
    }
  }
})


// use money from database to gamble
client.on('interactionCreate',  async (interaction) => {
  if(interaction.isChatInputCommand()) {
    if(interaction.commandName === 'gamble') {
      const winMsg = ['AYYY GOOD SHIT', 'LETS GOOOOO', 'You win!', 'You got lucky this time', 'FUCK YEA', 'YIPPEEEE']
      const loseMsg = ['BHAAHAHAH YOU SUCK', 'Good luck next time loser', 'Save yo money next time', 'Why are you still playing', 'How tf you get that wrong', 'BROOOO UR ASS']
      let msg = ""
      let embed = new EmbedBuilder()
        .setTitle('Peep Casino')
      if(await gamble.hasFunds(interaction.user.id, interaction.options.get('bet').value) === true) {
        let result = await gamble.coinFlip()
        if(interaction.options.get('guess').value === result) {
          embed.setColor('#2ECC71')
          let win = winMsg[Math.floor(Math.random() * winMsg.length)]
          let newBalance = await gamble.updateBalance(interaction.user.id, interaction.options.get('bet').value)
          msg = 'Bet: $' + interaction.options.get('bet').value + '\nGuess: ' + interaction.options.get('guess').value + '\nResult: ' + result + '\n\n' + win + '\nNew balance: $' + newBalance
        }
        else {
          embed.setColor('#E74C3C')
          let lose = loseMsg[Math.floor(Math.random() * loseMsg.length)]
          let newBalance = await gamble.updateBalance(interaction.user.id, 0 - interaction.options.get('bet').value)
          msg = 'Bet: $' + interaction.options.get('bet').value + '\nGuess: ' + interaction.options.get('guess').value + '\nResult: ' + result + '\n\n' + lose + '\nNew balance: $' + newBalance
        }
      }
      else 
        msg = 'Insufficient funds'

        embed.setDescription(msg)

        await interaction.reply({
          embeds : [embed]
        })
    }
    // FLIP COIN
    else if(interaction.commandName === 'flipcoin') {
      let result = await gamble.coinFlip()
      let embed = new EmbedBuilder()
        .setTitle('Peep Casino')
        .setDescription(result)
        .setColor('#3498DB')

        await interaction.reply({
          embeds : [embed]
        })
    }
    // check player balance
    else if(interaction.commandName === 'balance') {
      let result
      let mentionedUser = interaction.options.get('user')
      let msg

      let embed = new EmbedBuilder()
        .setTitle('Peep Casino')
        .setColor('#3498DB')

      if(mentionedUser == null) {
        result = await gamble.getBalance(interaction.user.id)
        msg = 'You have $' + result
      }
      else {
        result = await gamble.getBalance(mentionedUser.user.id)
        msg = mentionedUser.user.username + ' has $' + result
      }

       embed.setDescription(msg)
        await interaction.reply({
          embeds : [embed]
        })
    }
    // lone a user some money
    else if(interaction.commandName === 'loan') {
      let user = interaction.options.get('user').user.id
      let amount = interaction.options.get('amount').value
      let msg = ""
      if(await gamble.hasFunds(interaction.user.id, amount)) {
        await gamble.updateBalance(interaction.user.id, 0 - amount)
        await gamble.updateBalance(user, amount)
        msg = `<@${interaction.user.id}>` + ' -->  $' + amount + '  --> ' + `<@${user}>` + '\n\nTransfer completed'
      }
      else 
        msg = 'Insufficient funds'

        let embed = new EmbedBuilder()
        .setTitle('Peep Casino')
        .setDescription(msg)
        .setColor('#3498DB')

        await interaction.reply({
          embeds : [embed]
        })
    }

    // coin flip stats
    else if(interaction.commandName === 'coinstats') {
      let msg = await gamble.coinStats()
      let embed = new EmbedBuilder()
        .setTitle('Peep Casino')
        .setDescription(msg)
        .setColor('#3498DB')

        await interaction.reply({
          embeds : [embed]
        })
    }

    // leaderboard
    else if(interaction.commandName === 'leaderboard') {
      let users = await gamble.leaderboardUsers()
      let balances = await gamble.leaderboardMoney()
      let msg = ""
      let currentUser
      let embed = new EmbedBuilder()
        .setTitle('Peep Casino')
        .setColor('#3498DB')
    

      for(i = 0; i < users.length; i++){
        currentUser = await interaction.guild.members.fetch(users[i])
        msg += (i + 1) + '. ' + currentUser.user.username + '  -->  $' + balances[i] + '\n'
      }

      embed.setDescription(msg)

        await interaction.reply({
          embeds : [embed]
        })

    }
  }
})


function dailyMoney() {
  var date = new Date()
  if(date.getHours() === 0 && date.getMinutes() === 0) {
    gamble.dailyMoney()
  }
}



client.login(process.env.TOKEN)

