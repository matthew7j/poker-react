import React, { Component } from 'react';
// import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';
import socket from '../../utilities/socketConnection';
import NewTableForm from '../NewTableForm/NewTableForm';
import * as actionTypes from '../../store/actions';
import Player from '../../classes/Player/Player';

class App extends Component {
  addNewTableButtonHandler = (event, player) => {
    event.preventDefault();
    console.log('in button handler');
    const table = {
      id: null
    };
    console.log('emitting createNewTable');
    socket.emit('createNewTable', table, player, (tableId, playerId) => {
      const playerObject = new Player(playerId, player.name, player.chips);
      this.props.onPlayerAdd(playerObject);
    });
  };

  
  render = () => {
    return (
      <div className='App'>
        <NewTableForm addNewTableButtonHandler = { this.addNewTableButtonHandler }/>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    tableId: state.tableId,
    players: state.players
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPlayerAdd: (player) => {
      console.log('on Player Add')
      return dispatch({
        type: actionTypes.ADD_PLAYER,
        player
      })
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default App;
