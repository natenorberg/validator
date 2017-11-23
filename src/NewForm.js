// @flow
import * as React from 'react';
import {TextField, RaisedButton, Dialog} from 'material-ui';
import NewValidator from './NewValidator';
import formatMessage from './formatMessage';

type FormState = {
  name: string,
  favoriteBeer: string,
  age?: number,
  submitted: boolean,
  nameValid: boolean,
  favoriteBeerValid: boolean,
  ageValid: boolean,
};

type ValidationErrors = {[key: string]: Object}; // TODO: Check object shape somehow

const errorTextStyle = {
  color: 'red',
};

export const requiredField = (field: string) => (value: *) => {
  return value || value === 0 ? null : {required: {field}};
};

const messages = {
  required: {
    id: 'required',
    defaultMessage: '{field} is required',
  },
  underage: {
    id: 'underage',
    defaultMessage: '{age} is too young for beer',
  },
  noLiteBeer: {
    id: 'noLiteBeer',
    defaultMessage: 'Get out',
  },
};

const required = (value: *) => {
  return value || value === 0 ? null : {required: {}};
};

const legalDrinker = (age: number) => {
  if (age < 21) {
    return {
      underage: {age},
    };
  }

  return null;
};

const noLiteBeer = (beer: string) => {
  if (beer.toLowerCase().includes('lite')) {
    return {noLiteBeer: {}};
  }
};

export class Form extends React.Component<{}, FormState> {
  state = {
    name: '',
    favoriteBeer: '',
    submitted: false,
    nameValid: false,
    favoriteBeerValid: false,
    ageValid: false,
  };

  setName = (e: SyntheticInputEvent, name: string) => {
    this.setState(() => ({name}));
  };

  setNameValid = (valid: boolean) => {
    this.setState(() => ({nameValid: valid}));
  };

  setFavoriteBeer = (e: SyntheticInputEvent, favoriteBeer: string) => {
    this.setState(() => ({favoriteBeer}));
  };

  setFavoriteBeerValid = (valid: boolean) => {
    this.setState(() => ({favoriteBeerValid: valid}));
  };

  setAge = (e: SyntheticInputEvent, ageString: string) => {
    const age = ageString === '' ? 0 : parseInt(ageString);
    if (!isNaN(age)) {
      this.setState(() => ({age}));
    }
  };

  setAgeValid = (valid: boolean) => {
    this.setState(() => ({ageValid: valid}));
  };

  submitForm = () => {
    this.setState(() => ({submitted: true}));
  };

  closeSubmitConfirmation = () => {
    this.setState(() => ({submitted: false}));
  };

  isValid = () => {
    return this.state.favoriteBeerValid;
  };

  renderValidationErrors = (errors: ValidationErrors | null) => {
    if (!errors) {
      return null;
    }
    console.log(errors);

    return Object.keys(errors).map(key => {
      const error = errors[key];
      console.log(key, error);

      return <div style={errorTextStyle}>{formatMessage(messages[key], error)}</div>;
    });
  };

  renderStatusEmoji = (valid: boolean) => (valid ? '😃' : '😩');

  render() {
    return (
      <div className="Form">
        <NewValidator value={this.state.name} rules={[requiredField('Name')]}>
          {({value, errors, touched, valid}) => (
            <div className="field">
              {this.renderStatusEmoji(valid)}
              <TextField hintText="Name" value={value} onChange={this.setName} />
              {touched && this.renderValidationErrors(errors)}
            </div>
          )}
        </NewValidator>
        <NewValidator
          value={this.state.favoriteBeer}
          rules={[requiredField('Favorite beer'), noLiteBeer]}
        >
          {({value, errors, touched, valid}) => (
            <div className="field">
              {this.renderStatusEmoji(valid)}
              <TextField hintText="Favorite Beer" value={value} onChange={this.setFavoriteBeer} />
              {touched && this.renderValidationErrors(errors)}
            </div>
          )}
        </NewValidator>
        <NewValidator value={this.state.age} rules={[requiredField('Age'), legalDrinker]}>
          {({value, errors, touched, valid}) => (
            <div className="field">
              {this.renderStatusEmoji(valid)}
              <TextField hintText="Age" type="number" value={value} onChange={this.setAge} />
              {touched && this.renderValidationErrors(errors)}
            </div>
          )}
        </NewValidator>
        <div>
          <RaisedButton
            label="Submit"
            primary
            style={{marginTop: 8}}
            onClick={this.submitForm}
            disabled={!this.isValid()}
          />
        </div>

        <Dialog
          open={this.state.submitted}
          title="Form submitted"
          onRequestClose={this.closeSubmitConfirmation}
        >
          We've recorded this somewhere
        </Dialog>
      </div>
    );
  }
}

export default Form;
