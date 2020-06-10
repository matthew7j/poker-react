const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Player = new Schema({
  id: Number,
  tableId: Number,
  name: String,
  chips: Number
});

module.exports = mongoose.model('Player', Player);