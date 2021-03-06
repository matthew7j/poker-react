import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './NewTableForm.module.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actionTypes from '../../store/actions';

class NewTableForm extends Component {
  state = {
    inputs: {
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
      chips: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Chip Count'
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

  componentDidMount = () => {
    this.props.clearReduxStore();
  };

  render = () => {
    const formElementsArray = [];

    for (let key in this.state.inputs) {
      formElementsArray.push({
        id: key,
        config: this.state.inputs[key]
      });
    }

    const personObject = {
      name: this.state.inputs.name.value,
      chips: this.state.inputs.chips.value
    };
  
    return (
      <div className = { classes.NewTableForm }>
        <form onSubmit = { event => this.props.addNewTableButtonHandler(event, personObject) }>
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

const mapDispatchToProps = dispatch => {
  return {
    clearReduxStore: () => {
      console.log('Clear Redux')
      return dispatch({
        type: actionTypes.CLEAR_REDUX
      })
    }
  };
};

export default connect(null, mapDispatchToProps)(NewTableForm);
