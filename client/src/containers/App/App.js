import React, { Component, Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import './App.css';
import socket from '../../utilities/socketConnection';
import NewTableForm from '../NewTableForm/NewTableForm';
import JoinTableForm from '../JoinTableForm/JoinTableForm';
import * as actionTypes from '../../store/actions';
import Player from '../../classes/Player/Player';
import Table from '../Table/Table';

const MAX_NUMBER_OF_PLAYERS = 6; // Change this to be dynamic

class App extends Component {
  addNewTableButtonHandler = (event, player) => {
    event.preventDefault();

    const tableId = Math.floor(100000 + Math.random() * 900000);
    const table = {
      id: tableId,
      maxNumberOfPlayers: MAX_NUMBER_OF_PLAYERS
    };

    const playerId = Math.floor(100000 + Math.random() * 900000);
    const playerObject = new Player(playerId, player.name, player.chips, 0, tableId);

    table.creatorId = playerId;

    console.log('emitting createNewTable');
    socket.emit('createNewTable', table, playerObject, (players, table) => {

      // Add table to redux store
      this.props.onCreateTable(table);

      // Add player to redux store
      this.props.onPlayerAdd(playerObject);

      // const { cookies } = this.props;

      // // Add player and table to cookies
      // cookies.set(tableId, playerId, { path: '/', maxAge: 36000 });

      // Redirect to table URL
      this.props.history.push(`/tables/${tableId}`);
    });
  };

  joinTableButtonHandler = (tableId) => {
    // Does this browser already have a session at this table?
    const playerId = this.props.playerId;

    // Add tableId to state
    this.props.onJoinTable(tableId, playerId);

    // Redirect to table URL
    this.props.history.push(`/tables/${tableId}`);
  };
  
  render = () => {
    return (
      <div className='App'>
        <Route exact path = '/' 
          render = { () => (
            <Fragment>
              <div>
                <NewTableForm addNewTableButtonHandler = { this.addNewTableButtonHandler }/>
                <JoinTableForm joinTableButtonHandler = { this.joinTableButtonHandler }/>
              </div>
            </Fragment>
          )}
        />
        <Route path = '/tables/:tableId'
          render = { () => {
            return (
              <Fragment>
                <Table />
              </Fragment>
            )
          }}
        />
      </div>
    );
  };
};

const mapStateToProps = (state, ownProps) => {
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
    onCreateTable: (table) => {
      console.log('on Create Table')
      return dispatch({
        type: actionTypes.CREATE_TABLE,
        table
      })
    },
    onJoinTable: (tableId, playerId = null) => {
      console.log('on Join Table')
      return dispatch({
        type: actionTypes.JOIN_TABLE,
        tableId,
        playerId
      })
    },
  };
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(withRouter(App)));
