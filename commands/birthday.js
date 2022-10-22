require('dotenv/config')
const Birthday = require('../models/birthdayModel')
const mongoose = require('mongoose')

mongoose.connect(process.env.dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => console.log('connected to dB'))
  .catch((err) => console.log(err))

async function doesExist(Username) {
  
  const result = await Birthday.findOne({username: Username})
    
    return result
}


function addBirthday (Username, Month, Day) {
  const birthday = new Birthday({
      username: Username,
      month: Month,
      day: Day
  });

  birthday.save();

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return months[Month - 1] + " " + Day + " logged."
}

async function removeBirthday (Username) {
    if(await doesExist(Username) === null){
      return "Birthday is not in databse"
    }
    else {
      await Birthday.deleteOne({username: Username})
      return "Birthday has been removed"
    }
}

async function findBirthday(Username) {
  if(await doesExist(Username) === null){
    console.log(Username)
    return "Birthday is not in database"
  }
  else {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const birthday = await Birthday.findOne({username: Username})
    const month = birthday.month
    const day = birthday.day

    return months[month - 1] + " " + day
  }
}

async function checkBirthday() {
  var date = new Date();
  var today = [date.getMonth() + 1, date.getDate()]
  const birthday = await Birthday.findOne({month: today[0], day: today[1]})
  if(birthday != null)
  {
    return birthday.username
  }

  else 
    return null
}

module.exports.addBirthday = addBirthday;
module.exports.doesExist = doesExist;
module.exports.removeBirthday = removeBirthday
module.exports.findBirthday = findBirthday
module.exports.checkBirthday = checkBirthday