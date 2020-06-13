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
      showModal: true
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
    if (Object.keys(this.props.player).length !== 0) {
      console.log('Player already has seat');
      if (!this.state.playerAlreadyHasSeat) {
        this.setPlayerAlreadyHasSeat(true);
      }
    } else {
      if (this.state.playerAlreadyHasSeat) {
        this.setPlayerAlreadyHasSeat(false);
      }
    }
  };

  componentDidUpdate = () => {
    if (Object.keys(this.props.player).length !== 0) {
      if (!this.state.playerAlreadyHasSeat) {
        this.setPlayerAlreadyHasSeat(true);
      }
    } else {
      if (this.state.playerAlreadyHasSeat) {
        this.setPlayerAlreadyHasSeat(false);
      }
    }
  }

  render = () => {
    let jsx = null;
    let classesArray = [];
    classesArray.push(classes.Seat);

    if (this.props.player && this.props.playerInThisSeat && (this.props.player.id === this.props.playerInThisSeat.id)) {
      jsx = (
        <div className = { classes.seatTakenByPlayer } style = { this.props.styleProp }>
          <p>{ this.props.player.name } &nbsp;	&nbsp;	&nbsp; { this.props.player.chips }</p>
        </div>
      );
    } else if (this.props.playerInThisSeat) {
      jsx = (
        <div className = { classes.seatTaken } style = { this.props.styleProp }>
          <p>{ this.props.playerInThisSeat.name } &nbsp;	&nbsp;	&nbsp; { this.props.playerInThisSeat.chips }</p>
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
    player: state.player,
    cookies: ownProps.cookies
  };
};


export default withCookies(connect(mapStateToProps, null)(Seat));
