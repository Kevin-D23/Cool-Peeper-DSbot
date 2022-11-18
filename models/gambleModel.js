const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gambleSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    win: {
        type: Number,
        required: false
    },
    loss: {
        type: Number,
        required: false
    }
});

const Gamble =  mongoose.model('Gamble', gambleSchema);
module.exports = Gamble