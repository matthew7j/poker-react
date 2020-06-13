const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://matthew7j:123@cluster0-r6alk.mongodb.net/pokerData', { useNewUrlParser: true, useUnifiedTopology: true });
const Table = require('./models/Table');
const Player = require('./models/Player');
const PlayerHand = require('./models/PlayerHand');

const { getShuffledDeck } = require('./modules/cards');

const port = 7777;
let app = express();
const server = app.listen(port);
const io = socketio(server);

io.on('connect', socket => {  
  let cardsMap = new Map();

  socket.on('findAndUpdateCurrentSocketIfItExists', async (socketId, player = null, callback) => {
    console.log('server: findCurrentSocketIfItExists');
    let result = null;

    console.log(`socket: ${JSON.stringify(socketId)}`);
    console.log(`player: ${JSON.stringify(player)}`);

    if (player.id) {
      let playerId = player.id;
      let currentPlayer = await getPlayer(playerId);
      currentPlayer = await getPlayer(playerId);
      console.log(`currentPlayer socketId: ${JSON.stringify(currentPlayer.socketId)}`);
      console.log(`socketId: ${JSON.stringify(socketId)}`);
      if (currentPlayer.socketId != socketId) {
        console.log(`adding player!!!!`);
        currentPlayer.socketId = socketId;
        result = await addPlayer(currentPlayer);
      }
    }
    
    callback(result);
  });

  socket.on('createNewTable', async (table, player, callback) => {
    const addTableResponse = await addNewTableDataToMongo(table);
    console.log(addTableResponse);
    player.socketId = socket.id;
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
    player.socketId = socket.id;
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

  socket.on('startNewHand', async table => {
    let cards = getShuffledDeck();
    cardsMap.set(table.id, cards);
    let playersArray = await getPlayersFromTable(table.id);

    for(let i = 0; i < playersArray.length; i++) {
      const player = playersArray[i];

      const hand = {
        card1: cards.pop(),
        card2: cards.pop(),
        playerId: player.id
      }

      await addPlayerCardsToMongo(hand);

      io.to(player.socketId).emit('dealCards', hand.card1);
      io.to(player.socketId).emit('dealCards', hand.card2);
    }

    console.log(`cards length after: ${cards.length}`);

    cardsMap.set(table.id, cards);
  });
});

function getTable (tableId) {
  return new Promise((resolve, reject) => {
    Table.find({ id: tableId }, (err, result) => {
      resolve(result[0]);
    });
  });
};

function getPlayer (playerId) {
  return new Promise((resolve, reject) => {
    Player.find({ id: playerId }, (err, result) => {
      if (result.length > 0) {
        resolve(result[0]);
      }
      resolve(null);
    });
  });
};

function addPlayer (player) {
  return new Promise((resolve, reject) => {
    let newPlayerObject = new Player(player);
    newPlayerObject.save();

    resolve(newPlayerObject);
  });
};

function getPlayersFromTable (tableId) {
  return new Promise((resolve, reject) => {
    Player.find({ tableId: tableId }, ((err, result) => {
      resolve(result);
    }));
  });
};

function addPlayerCardsToMongo (hand) {
  return new Promise((resolve, reject) => {
    let newHandObject = new PlayerHand(hand);
    newHandObject.save();

    resolve(newHandObject);
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
    Player.findOneAndDelete({ id: player.id }, ((err, result) => {
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