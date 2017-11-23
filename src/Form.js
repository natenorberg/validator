// @flow
import * as React from 'react';
import {Card, CardHeader, CardText, TextField, RaisedButton, Dialog} from 'material-ui';

type FormState = {
  name: string,
  favoriteBeer: string,
  age?: number,
  submitted: boolean,
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

  render() {
    return (
      <div className="Form">
        <div className="field">
          <TextField hintText="Name" value={this.state.name} onChange={this.setName} />
        </div>
        <div className="field">
          <TextField
            hintText="Favorite Beer"
            value={this.state.favoriteBeer}
            onChange={this.setFavoriteBeer}
          />
        </div>
        <div className="field">
          <TextField hintText="Age" value={this.state.age} onChange={this.setAge} />
        </div>
        <div>
          <RaisedButton label="Submit" primary style={{marginTop: 8}} onClick={this.submitForm} />
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
