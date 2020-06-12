import React, { Component, Fragment } from 'react';

import Input from '../../components/UI/Input/Input';
import classes from './AddPlayerModal.module.css';
import Button from '../../components/UI/Button/Button';
import Backdrop from '../../components/UI/Backdrop/Backdrop';

class AddPlayerModal extends Component {
  state = {
    nameForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Display Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      chipAmount: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Chip Amount'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
    },
    formIsValid: false
  };

  addPlayerHandler = event => {
    event.preventDefault();

    this.props.addPlayerHandler(this.state.nameForm.name.value, this.state.nameForm.chipAmount.value, this.props.seatIndex);
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (rules) {
      if (rules.required) {
        isValid = value.trim() !== '' && isValid;
      }
  
      if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
      }
  
      if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
      }
    }

    return isValid;
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedNameForm = { ...this.state.nameForm };
    const updatedNameElement = { ...updatedNameForm[inputIdentifier] };
    updatedNameElement.value = event.target.value;
    updatedNameElement.valid = this.checkValidity(updatedNameElement.value, updatedNameElement.validation);
    updatedNameElement.touched = true;
    updatedNameForm[inputIdentifier] = updatedNameElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedNameForm) {
      formIsValid = updatedNameForm[inputIdentifier].valid && formIsValid;
    }

    this.setState({ nameForm: updatedNameForm, formIsValid });
  };

  render = () => {
    const formElementsArray = [];

    for (let key in this.state.nameForm) {
      formElementsArray.push({
        id: key,
        config: this.state.nameForm[key]
      });
    }

    if (!this.props.show) {
      return null;
    }

    let form = (
      <Fragment>
        <Backdrop show = { this.props.show } clicked = { this.props.modalClosed }/>
        <div className = { classes.addPlayerModal } >
          <form onSubmit = { event => this.addPlayerHandler(event) }>
            { formElementsArray.map(formElement => (
                <Input key = { formElement.id }
                  elementType = { formElement.config.elementType } 
                  elementConfig = { formElement.config.elementConfig } 
                  value = { formElement.config.value }
                  changed = { event => this.inputChangedHandler(event, formElement.id) }
                  shouldValidate = { formElement.config.validation }
                  touched = { formElement.config.touched }
                  invalid = { !formElement.config.valid } />
                )
              )
            }
            <Button color = 'primary' >Submit</Button>
          </form>
        </div>
      </Fragment>
    );

    return form
  };

};

export default AddPlayerModal;
