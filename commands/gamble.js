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

      if(result === 1) {
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
        money: 1000
    })

    user.save()
}

async function removePlayer(Username) {
    await Gamble.deleteOne({username: Username})
}

async function dailyMoney() {
    let cursor = await Gamble.collection.find()
    .forEach((doc) => {
        if(doc) {
            if(doc._id.valueOf() !== '6373df608946ca2d379f4aa9')
                updateBalance(doc.username, 200)
        }
    })
}

async function coinStats() {
    const result = await Gamble.findOne({_id: '6373df608946ca2d379f4aa9'})
    const heads = parseInt(result.username)
    const tails = result.money
    const headsPerc = Math.round(heads / (heads + tails))
    const tailsPerc = 1 - headsPerc
    return 'Heads: ' + heads + ' %' + headsPerc + '\nTails: ' + tails + ' %' + tailsPerc
}

async function leaderboardUsers() {
    let users = new Array(5)
    let result = await Gamble.find().sort({money: -1})   
    for(i = 0; i < users.length; i++)
        users[i] = result[i].username
    return users
}

async function leaderboardMoney() {
    let bal = new Array(5)
    let result = await Gamble.find().sort({money: -1})   
    for(i = 0; i < bal.length; i++)
        bal[i] = result[i].money
    return bal
}

module.exports.hasFunds = hasFunds;
module.exports.getBalance = getBalance;
module.exports.coinFlip = coinFlip
module.exports.updateBalance = updateBalance
module.exports.addPlayer = addPlayer
module.exports.removePlayer = removePlayer
module.exports.dailyMoney = dailyMoney
module.exports.coinStats = coinStats
module.exports.leaderboardUsers = leaderboardUsers
module.exports.leaderboardMoney = leaderboardMoney