// @flow
import * as React from 'react';
import {TextField, RaisedButton, Dialog} from 'material-ui';
import {ValidationField, ValidationGroup} from './NewValidator';
import formatMessage from './formatMessage';

type ValidationErrors = {[key: string]: Object}; // TODO: Check object shape somehow

type FormState = {
  name: string,
  favoriteBeer: string,
  age?: number,
  submitted: boolean,
};

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
  };

  setName = (e: SyntheticInputEvent, name: string) => {
    this.setState(() => ({name}));
  };

  setFavoriteBeer = (e: SyntheticInputEvent, favoriteBeer: string) => {
    this.setState(() => ({favoriteBeer}));
  };

  setAge = (e: SyntheticInputEvent, ageString: string) => {
    const age = ageString === '' ? 0 : parseInt(ageString);
    if (!isNaN(age)) {
      this.setState(() => ({age}));
    }
  };

  submitForm = () => {
    this.setState(() => ({submitted: true}));
  };

  closeSubmitConfirmation = () => {
    this.setState(() => ({submitted: false}));
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

  renderStatusEmoji = (valid: boolean) => (valid ? '😃 ' : '😩 ');

  render() {
    const {name, favoriteBeer, age} = this.state;

    return (
      <ValidationGroup
        rules={{
          name: [requiredField('Name')],
          favoriteBeer: [requiredField('Favorite beer'), noLiteBeer],
          age: [requiredField('Age'), legalDrinker],
        }}
        values={{name, favoriteBeer, age}}
      >
        {({valid}) => (
          <div className="Form">
            <ValidationField name="name">
              {({value, errors, touched, valid}) => (
                <div className="field">
                  {this.renderStatusEmoji(valid)}
                  <TextField hintText="Name" value={value} onChange={this.setName} />
                  {touched && this.renderValidationErrors(errors)}
                </div>
              )}
            </ValidationField>
            <ValidationField name="favoriteBeer">
              {({value, errors, touched, valid}) => (
                <div className="field">
                  {this.renderStatusEmoji(valid)}
                  <TextField
                    hintText="Favorite Beer"
                    value={value}
                    onChange={this.setFavoriteBeer}
                  />
                  {touched && this.renderValidationErrors(errors)}
                </div>
              )}
            </ValidationField>
            <ValidationField name="age">
              {({value, errors, touched, valid}) => (
                <div className="field">
                  {this.renderStatusEmoji(valid)}
                  <TextField hintText="Age" type="number" value={value} onChange={this.setAge} />
                  {touched && this.renderValidationErrors(errors)}
                </div>
              )}
            </ValidationField>
            <div>
              <RaisedButton
                label="Submit"
                primary
                style={{marginTop: 8}}
                onClick={this.submitForm}
                disabled={!valid}
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
        )}
      </ValidationGroup>
    );
  }
}

export default Form;
