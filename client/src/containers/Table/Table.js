import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';

import classes from './Table.module.css';
import Seat from '../Seat/Seat';
import tablePositions from '../../constants/tablePositions.json';
import socket from '../../utilities/socketConnection';
import * as actionTypes from '../../store/actions';
import Button from '../../components/UI/Button/Button';
import Player from '../../classes/Player/Player';

class Table extends Component {
  getCurrentTableStateFromServer = () => {
    let tableId;

    if (this.props.player !== undefined && this.props.player.tableId !== undefined) {
      tableId = this.props.player.tableId;
    } else {
      tableId = this.props.match.params.tableId;
    }

    console.log('emitting getTableState');
    socket.emit('getTableState', tableId, (playersArray, tableObject) => {
      this.props.onPlayersUpdate(playersArray);
      this.props.onTableCreation(tableObject);
    });
  };

  addPlayerHandler = (name, chips, seatIndex) => {
    console.log('emitting addPlayerToTable');
    const playerId = Math.floor(100000 + Math.random() * 900000);
    const playerObject = new Player(playerId, name, parseInt(chips), seatIndex, this.props.match.params.tableId);

    socket.emit('addPlayerToTable', playerObject, (playersArray) => {
      // add player to state
      this.props.onAddNewPlayer(playerObject);
    });
  };

  componentDidMount = () => {
    console.log(`[TABLE] componentDidMount`);

    // need to find another way to do this
    setTimeout(() => { 
      socket.emit('findAndUpdateCurrentSocketIfItExists', socket.id, this.props.player, () => {
        this.getCurrentTableStateFromServer();
      });

      socket.on('syncPlayers', players => {
        this.props.onPlayersUpdate(players);
      });

      socket.on('dealCards', cards => {
        console.log(`cards: ${JSON.stringify(cards)}`);
      });
    }, 1000);
  }

  componentWillUnmount = () => {
    socket.off('syncPlayers');
    socket.off('dealCards');

    socket.disconnect();
  }

  removePlayerButtonHandler = () => {
    // Emit to server and remove player
  
    socket.emit('removePlayerFromTable', this.props.player, (playersArray) => {
      console.log(`array after remove player: ${JSON.stringify(playersArray)}`);
      this.props.onLeaveTable(playersArray);

      // Redirect to root URL
      this.props.history.push(`/`);
    });
  };

  startNewHand = () => {
    // Emit to server, shuffle cards and deal to players

    socket.emit('startNewHand', this.props.table);
  };
  
  render = () => {
    console.log('rendering...');
    const seatsJsx = [];
    const maxNumberOfPlayers = 6;

    for (let i = 0; i < maxNumberOfPlayers; i++) {
      const tablePositionStyles = tablePositions[maxNumberOfPlayers].positions[i];
      seatsJsx.push(
        <Seat key = { i } 
          styleProp = { tablePositionStyles.styles }
          seatIndex = { i }
          player = { null }
          addPlayerHandler = { this.addPlayerHandler }
          tableId = { this.props.tableId }
          playerId = { this.props.currentPlayerId }
        />
      );
    }

    for (let i = 0; i < this.props.players.length; i++) {
      const currentPlayer = this.props.players[i];
      const tablePositionStyles = tablePositions[maxNumberOfPlayers].positions[currentPlayer.seatIndex];

      seatsJsx[currentPlayer.seatIndex] = (
        <Seat key = { currentPlayer.seatIndex } 
          styleProp = { tablePositionStyles.styles }
          seatIndex = { currentPlayer.seatIndex }
          playerInThisSeat = { currentPlayer }
          addPlayerHandler = { this.addPlayerHandler }
          tableId = { this.props.tableId }
        />
      );
    };

    return (
      <Fragment>
        <Button 
          color = 'white' 
          clicked = { this.removePlayerButtonHandler } >
            Leave Table
        </Button>
        <div className = { classes.Table }>
          { seatsJsx }
        </div>
        <Button 
          color = 'white' 
          clicked = { this.startNewHand } >
            Leave Table
        </Button>
      </Fragment>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    table: state.table,
    players: state.players,
    player: state.player,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPlayersUpdate: (players) => {
      return dispatch({
        type: actionTypes.UPDATE_PLAYERS,
        players
      })
    },
    onAddNewPlayer: player => {
      return dispatch({
        type: actionTypes.ADD_NEW_PLAYER,
        player
      })
    },
    onNewPlayer: (player) => {
      return dispatch({
        type: actionTypes.NEW_PLAYER,
        player
      })
    },
    onLeaveTable: (playerId, tableId) => {
      console.log('on Leave Table')
      return dispatch({
        type: actionTypes.LEAVE_TABLE,
        tableId,
        playerId
      })
    },
    onTableCreation: (table) => {
      return dispatch({
        type: actionTypes.ADD_TABLE_TO_REDUX,
        table
      });
    }
  };
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(withRouter(Table)));