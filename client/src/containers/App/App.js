import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';
import socket from '../../utilities/socketConnection';
import NewTableForm from '../NewTableForm/NewTableForm';
import * as actionTypes from '../../store/actions';
import Player from '../../classes/Player/Player';
import Table from '../../components/Table/Table';

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

      // Add table to redux store
      this.props.onCreateTable(tableId);

      // Add player to redux store
      this.props.onPlayerAdd(playerObject);

      // Redirect to table URL
      this.props.history.push(`/tables/${tableId}`);
    });
  };

  
  render = () => {
    return (
      <div className='App'>
        <Route exact path = '/'>
          <NewTableForm addNewTableButtonHandler = { this.addNewTableButtonHandler }/>
        </Route>

        <Route path = '/tables/:tableId'>
          <Table tableId = { this.props.tableId } />
        </Route>
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
    },
    onCreateTable: (tableId) => {
      console.log('on Create Table')
      return dispatch({
        type: actionTypes.CREATE_TABLE,
        tableId
      })
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
