// @flow
import * as React from 'react';
import {TextField, RaisedButton, Dialog} from 'material-ui';
import OldValidator, {requiredField} from './OldValidator';

type FormState = {
  name: string,
  favoriteBeer: string,
  age?: number,
  submitted: boolean,
  nameValid: boolean,
  favoriteBeerValid: boolean,
  ageValid: boolean,
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

const legalDrinker = (age: number) => {
  console.log('legal drinker checker', age);

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

  render() {
    return (
      <div className="Form">
        <div className="field">
          <OldValidator
            value={this.state.name}
            rules={[requiredField('Name')]}
            errorMessages={messages}
            onValidityChanged={this.setNameValid}
          >
            <TextField hintText="Name" value={this.state.name} onChange={this.setName} />
          </OldValidator>
        </div>
        <div className="field">
          <OldValidator
            value={this.state.favoriteBeer}
            rules={[requiredField('Favorite beer'), noLiteBeer]}
            errorMessages={messages}
            onValidityChanged={this.setFavoriteBeerValid}
          >
            <TextField
              hintText="Favorite Beer"
              value={this.state.favoriteBeer}
              onChange={this.setFavoriteBeer}
            />
          </OldValidator>
        </div>
        <div className="field">
          <OldValidator
            value={this.state.age}
            rules={[requiredField('Age'), legalDrinker]}
            errorMessages={messages}
            onValidityChanged={this.setAgeValid}
          >
            <TextField hintText="Age" value={this.state.age} onChange={this.setAge} />
          </OldValidator>
        </div>
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
