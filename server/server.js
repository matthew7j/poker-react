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
    const addTableResponse = await addNewTableDataToMongo(table);
    console.log(addTableResponse);
    const addPlayerResponse = await addNewPlayerDataToMongo(player);
    console.log(addPlayerResponse);

    callback(addPlayerResponse, addTableResponse);
  });

  socket.on('getTableState', async (tableId, callback) => {
    const tableObject = await getTable(tableId);
    const playersArray = await getPlayersFromTable(tableId);

    callback(playersArray, tableObject);
  });

  socket.on('addPlayerToTable', async (player, callback) => {
    const addPlayerResponse = await addNewPlayerDataToMongo(player);
    console.log(addPlayerResponse);
  
    let playersArray = await getPlayersFromTable(player.tableId);
    playersArray = await getPlayersFromTable(player.tableId);

    io.emit('syncPlayers', playersArray);

    callback();
  });

  socket.on('removePlayerFromTable', async (player, callback) => {
    const tableId = player.tableId;
    await removePlayerDataFromMongo(player);
  
    let playersArray = await getPlayersFromTable(tableId);
    playersArray = await getPlayersFromTable(tableId);
    
    io.emit('syncPlayers', playersArray);
  
    callback();
  });
});

function getTable (tableId) {
  return new Promise((resolve, reject) => {
    Table.find({ id: tableId }, (err, result) => {
      resolve(result[0]);
    });
  });
};

function getPlayersFromTable (tableId) {
  return new Promise((resolve, reject) => {
    Player.find({ tableId: tableId }, ((err, result) => {
      resolve(result);
    }));
  });
};

function addNewPlayerDataToMongo (player) {
  return new Promise((resolve, reject) => {
    let newPlayerObject = new Player(player);
    newPlayerObject.save();

    resolve(newPlayerObject);
  });
};

function removePlayerDataFromMongo(player) {
  return new Promise((resolve, reject) => {
    console.log(`going to remove id: ${player.id}`);
    Player.findOneAndDelete({ id: player.id }, ((err, result) => {
      console.log(`deleted? ${JSON.stringify(result)}`);
      resolve(result);
    }));
  });
};

function addNewTableDataToMongo (table) {
  return new Promise((resolve, reject) => {
    let newTableObject = new Table(table);
    newTableObject.save();

    resolve(newTableObject);
  });
};