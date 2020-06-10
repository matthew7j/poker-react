const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://matthew7j:123@cluster0-r6alk.mongodb.net/pokerData', { useNewUrlParser: true, useUnifiedTopology: true });
const Table = require('./models/Table');
const Player = require('./models/Player');

const port = 7777;
let app = express();
const server = app.listen(port);
const io = socketio(server);

io.on('connect', socket => {
  socket.on('createNewTable', async (table, player, callback) => {
    const tableId = Math.floor(100000 + Math. random() * 900000);
    table.id = tableId;

    const playerId = Math.floor(100000 + Math. random() * 900000);
    player.id = playerId;
    player.tableId = tableId;

    const addTableResponse = await addNewTableDataToMongo(table);
    console.log(addTableResponse);
    const addPlayerResponse = await addNewPlayerDataToMongo(player);
    console.log(addPlayerResponse);

    callback(tableId, playerId);
  });
});

function addNewPlayerDataToMongo (player) {
  return new Promise((resolve, reject) => {
    let newPlayerObject = new Player(player);
    newPlayerObject.save();
    
    resolve(`New person added to table: ${ newPlayerObject }`);
  });
};

function addNewTableDataToMongo (table) {
  return new Promise((resolve, reject) => {
    let newTableObject = new Table(table);
    newTableObject.save();

    resolve(`New table being added: ${JSON.stringify(table)}`)
  });
};