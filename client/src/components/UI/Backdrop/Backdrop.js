import React from 'react';

import classes from './Backdrop.module.css';

const Backdrop = props => {
  console.log('doing a backdrop');
  return (
    props.show ? <div className = { classes.backdrop } onClick = { props.clicked }></div> : null
  )
};

export default Backdrop;