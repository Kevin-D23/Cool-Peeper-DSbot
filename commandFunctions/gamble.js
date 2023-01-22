require('dotenv/config')
const Gamble = require('../models/gambleModel')
const mongoose = require('mongoose')
const { findOne } = require('../models/birthdayModel')

mongoose.connect(process.env.dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => console.log('connected to dB'))
  .catch((err) => console.log(err))


async function hasFunds(Username, bet) {
    const user = await Gamble.findOne({username: Username})
    if(user.money >= bet)
        return true;
    else if(user.money < bet || user.money == 0)
        return false;
}

async function getBalance(Username) {
    const user = await Gamble.findOne({username: Username})
    return user.money
}

async function coinFlip() {
    let result = Math.floor(Math.random() * 2)
    let headsTailsStats = await Gamble.findOne({_id: '6373df608946ca2d379f4aa9'})
    let currentHeads = parseInt(headsTailsStats.username)
    let currentTails = headsTailsStats.money

      if(result === 0) {
        currentHeads += 1
        await Gamble.updateOne({_id: '6373df608946ca2d379f4aa9'}, {$set: {username: currentHeads.toString()}})
        return 'heads'
      }
      else {
        currentTails += 1
        await Gamble.updateOne({_id: '6373df608946ca2d379f4aa9'}, {$set: {money: currentTails}})
        return 'tails'
      }
}

async function updateBalance(Username, amount) {
     const currentBalance = await getBalance(Username)
     let newBalance = currentBalance + amount
     let result

     await Gamble.updateOne({username: Username}, {$set: {money: newBalance}})
     result = await getBalance(Username)
     return result
}

async function addPlayer(Username) {
    const user = new Gamble({
        username: Username,
        money: 1000,
        win: 0,
        loss: 0
    })

    user.save()
}

async function removePlayer(Username) {
    await Gamble.deleteOne({username: Username})
}

async function collectDaily(user) {
    let doc = await Gamble.findOne({username: user})
    let collected = doc.dailyCollected
    let dailyAmount = 200

    if(!collected){
        await Gamble.updateOne({username: user}, {$set: {dailyCollected: true}})
        updateBalance(user, dailyAmount)
        return true
    }
    else
        return false
}

async function coinStats() {
    const result = await Gamble.findOne({_id: '6373df608946ca2d379f4aa9'})
    const heads = parseInt(result.username)
    const tails = result.money
    const headsPerc = ((heads / (heads + tails)) * 100).toFixed(1)
    const tailsPerc = 100 - headsPerc
    return 'Heads: ' + heads + ' ' + headsPerc + "%\nTails: " + tails + ' ' + tailsPerc + '%'
}

async function leaderboardTopUsers() {
    let users = new Array(5)
    let result = await Gamble.find({__v: 0}).sort({money: -1})   
    for(i = 0; i < users.length; i++)
        users[i] = result[i].username
    return users
}

async function leaderboardTopMoney() {
    let bal = new Array(5)
    let result = await Gamble.find({__v: 0}).sort({money: -1})   
    for(i = 0; i < bal.length; i++)
        bal[i] = result[i].money
    return bal
}

async function leaderboardBotUsers() {
    let users = new Array(5)
    let result = await Gamble.find({__v: 0}).sort({money: 1})   
    for(i = 0; i < users.length; i++)
        users[i] = result[i].username
    return users
}

async function leaderboardBotMoney() {
    let bal = new Array(5)
    let result = await Gamble.find({__v: 0}).sort({money: 1})   
    for(i = 0; i < bal.length; i++)
        bal[i] = result[i].money
    return bal
}

async function winLoss (user, gameResult) {
    let wins = await Gamble.findOne({username: user})
    let losses = await Gamble.findOne({username: user})
    wins = wins.win
    losses = losses.loss
    let winrate
    if(gameResult === 'win')
        await Gamble.updateOne({username: user}, {$set: {win: wins + 1}})
    else if(gameResult === 'lose')
        await Gamble.updateOne({username: user}, {$set: {loss: losses + 1}})

    winrate = Math.round((wins / (wins + losses)) * 100)

    if(wins == 0 && losses == 0)
        return 0
    else
        return winrate
}

async function getPlacement(user) {
    let playerList = await Gamble.find({__v: 0}).sort({money: -1})
    for (i = 0; i < playerList.length; i++) {
        if(playerList[i].username == user)
            return i + 1
    }
}

async function resetDaily() {
    Gamble.collection.find().forEach(async(doc) => {
         await Gamble.updateOne({username: doc.username}, {$set: {dailyCollected: false}})
    }) 
}

function dailyMoney() {
    var date = new Date();
    if (date.getHours() === 0 && date.getMinutes() === 0) {
      resetDaily();
    }
  }



module.exports.hasFunds = hasFunds;
module.exports.getBalance = getBalance;
module.exports.coinFlip = coinFlip
module.exports.updateBalance = updateBalance
module.exports.addPlayer = addPlayer
module.exports.removePlayer = removePlayer
module.exports.collectDaily = collectDaily
module.exports.coinStats = coinStats
module.exports.leaderboardTopUsers = leaderboardTopUsers
module.exports.leaderboardTopMoney = leaderboardTopMoney
module.exports.winLoss = winLoss
module.exports.getPlacement = getPlacement
module.exports.resetDaily = resetDaily
module.exports.leaderboardBotMoney = leaderboardBotMoney
module.exports.leaderboardBotUsers = leaderboardBotUsers
module.exports.dailyMoney = dailyMoney