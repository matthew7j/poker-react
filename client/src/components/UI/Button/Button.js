import React from 'react';

import classes from './Button.module.css';

const Button = props => {
  let classesArray = [];
  classesArray.push(classes.button);

  classesArray.push(props.overrideClass);
  return (
    <button 
      className = {[ classes.button ].join(' ')}
      onClick = { props.clicked }
      disabled = { props.disabled }
    > { props.children } 
    </button>
  );
}

export default Button;
