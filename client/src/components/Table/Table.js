import React, { Component } from 'react';
import { connect } from 'react-redux';

import socket from '../../utilities/socketConnection';
import classes from './Table.module.css';
import * as actionTypes from '../../store/actions';

class Table extends Component {
  getCurrentTableStateFromServer = tableId => {
    socket.emit('getTableState', tableId, (playersArray, tableObject) => {
      this.props.onPlayersUpdate(playersArray);
    });
  };

  componentDidMount = () => {
    console.log(`in here tho ${this.props.tableId}`);
    this.getCurrentTableStateFromServer(this.props.tableId);
  };
  
  render = () => {  
    return (
      <div className = { classes.Table }>
        Table { this.props.tableId } will go here
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    tableId: state.tableId,
    players: state.players
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPlayersUpdate: (players) => {
      console.log('on Players Update')
      return dispatch({
        type: actionTypes.UPDATE_PLAYER,
        players
      })
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);