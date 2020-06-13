import React, { Component } from 'react';

import classes from './Timer.module.css';
 
let timerInterval;

class Timer extends Component {
  state = {
    time: null,
    disabled: true
  };

  updateTimer = () => {
    this.setState((prevState) => {
      const currTime = prevState.time;
      if (currTime === 1) {
        clearInterval(timerInterval);
      }
      return {
        time: currTime - 1
      };
    });
  };

  componentDidMount = () => {
    if (this.props.disabled) {
      this.setState(() => {
        return { time: this.props.time, disabled: true };
      });
    } else {
      this.setState(() => {
        return { time: this.props.time };
      });
    }
    
    if (this.props.time > 0 && !this.props.disabled) {
      timerInterval = setInterval(() => {
        this.updateTimer();
      }, 1000)
    }
  };

  render = () => {
    let timerType = null;
    if (this.state.time <= 2) {
      timerType = 'two';
    } else if (this.state.time <= 4) {
      timerType = 'four';
    } else if (this.state.time <= 7) {
      timerType = 'seven';
    } else {
      timerType = 'ten';
    }

    if (this.state.disabled) {
      timerType = 'disabled'
    }

    return (
      <p className = {[ classes.Timer, classes[timerType] ].join(' ')}> { this.state.time } </p>
    );
  };
};

export default Timer;
