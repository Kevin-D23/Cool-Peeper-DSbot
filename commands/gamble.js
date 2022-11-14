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

function coinFlip() {
    let result = Math.floor(Math.random() * 2)

      if(result === 0)
        return 'Heads'
      else if(result === 1)
        return 'Tails'
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
            updateBalance(doc.username, 200)
        }
    })
}

module.exports.hasFunds = hasFunds;
module.exports.getBalance = getBalance;
module.exports.coinFlip = coinFlip
module.exports.updateBalance = updateBalance
module.exports.addPlayer = addPlayer
module.exports.removePlayer = removePlayer
module.exports.dailyMoney = dailyMoney