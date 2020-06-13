import React, { Component } from 'react';

import classes from './Timer.module.css';
 
let timerInterval = null;

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
    console.log('component mounting..');
    this.setState(() => {
      return { time: this.props.time };
    });
    
    if (this.props.time > 0 && !this.props.disabled) {
      timerInterval = setInterval(() => {
        this.updateTimer();
      }, 1000)
    }
  };

  componentDidUpdate = () => {
    if (this.props.disabled) {
      if (!this.state.disabled) {
        this.setState(() => {
          return { time: this.props.time, disabled: true };
        });
      }

      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    if (this.props.time > 0 && !this.props.disabled && !timerInterval) {
      this.setState(() => {
        return { disabled: false };
      });
      timerInterval = setInterval(() => {
        this.updateTimer();
      }, 1000)
    }
  }

  componentWillUnmount = () => {
    clearInterval(timerInterval);
  }

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
