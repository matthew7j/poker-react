const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerHand = new Schema({
  card1: {
    suit: String,
    value: String
  },
  card2: {
    suit: String,
    value: String
  },
  playerId: String
});

module.exports = mongoose.model('PlayerHand', PlayerHand);