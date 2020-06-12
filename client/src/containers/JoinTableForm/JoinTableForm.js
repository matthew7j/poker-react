import React, { Component } from 'react';

import classes from './JoinTableForm.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

class JoinTableForm extends Component {
  state = {
    inputs: {
      tableId: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Table ID to join'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      }
    },
    formIsValid: false
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
    const updatedNameForm = { ...this.state.inputs };
    const updatedNameElement = { ...updatedNameForm[inputIdentifier] };
    updatedNameElement.value = event.target.value;
    updatedNameElement.valid = this.checkValidity(updatedNameElement.value, updatedNameElement.validation);
    updatedNameElement.touched = true;
    updatedNameForm[inputIdentifier] = updatedNameElement;
  
    let formIsValid = true;
    for (let inputIdentifier in updatedNameForm) {
      formIsValid = updatedNameForm[inputIdentifier].valid && formIsValid;
    }
  
    this.setState({ inputs: updatedNameForm, formIsValid });
  };

  render = () => {
    const formElementsArray = [];

    for (let key in this.state.inputs) {
      formElementsArray.push({
        id: key,
        config: this.state.inputs[key]
      });
    }

    return (
      <div className = { classes.JoinTableForm }>
        <form onSubmit = { event => this.props.joinTableButtonHandler(this.state.inputs.tableId.value) }>
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
    );
  }; 
};

export default JoinTableForm;