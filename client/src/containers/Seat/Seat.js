import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';

import Button from '../../components/UI/Button/Button';
import classes from './Seat.module.css';
import AddPlayerModal from '../../containers/AddPlayerModal/AddPlayerModal';

class Seat extends Component {
  state = {
    showNewPlayerModal: false,
    playerAlreadyHasSeat: false
  };

  addPlayerButtonHandler = () => {
    this.setState({
      showModal: true,
      playerAlreadyHasSeat: true
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  setPlayerAlreadyHasSeat = value => {
    this.setState({
      playerAlreadyHasSeat: value
    });
  };

  componentDidMount = () => {
    if (this.props.currentPlayerId) {
      console.log('Player already has seat');
      this.setPlayerAlreadyHasSeat(true);
    } else {
      console.log('Player does not already has seat');
      this.setPlayerAlreadyHasSeat(false);
    }
  };

  render = () => {
    let jsx = null;
    let classesArray = [];
    classesArray.push(classes.Seat);

    if (this.props.player) {
      jsx = (
        <div className = { classes.seatTaken } style = { this.props.styleProp }>
          <p>{ this.props.player.name } &nbsp;	&nbsp;	&nbsp; { this.props.player.chips }</p>
        </div>
      );
    } else {
      jsx = (
        <Fragment>
          <div className = { classesArray.join(' ') } style = { this.props.styleProp }>
            <Button 
              color = 'white' 
              clicked = { this.addPlayerButtonHandler }
              disabled = { this.state.playerAlreadyHasSeat }>
                Sit Here
            </Button>
          </div>
          <AddPlayerModal show = { this.state.showModal } modalClosed = { this.closeModal } addPlayerHandler = { this.props.addPlayerHandler } seatIndex = { this.props.seatIndex }/>
        </Fragment>
      );
    }
    return jsx;
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    tableId: state.tableId,
    players: state.players,
    currentPlayerId: state.currentPlayerId,
    cookies: ownProps.cookies
  };
};


export default withCookies(connect(mapStateToProps, null)(Seat));
