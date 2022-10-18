const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const birthdaySchema = new Schema({
    username: {
        type: String,
        required: true
    },
    month: {
        type: Number,
        required: true
    }, 
    day: {
        type: Number,
        required: true
    }
});

const Birthday =  mongoose.model('Birthday', birthdaySchema);
module.exports = Birthday