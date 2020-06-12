const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Table = new Schema({
  id: Number,
  creatorId: Number,
  maxNumberOfPlayers: Number
});

module.exports = mongoose.model('Table', Table);