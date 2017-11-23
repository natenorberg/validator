// @flow
import * as React from 'react';
import {Card, CardHeader, CardText, TextField} from 'material-ui';

type FormState = {
  name: string,
  favoriteBeer: string,
  age?: number,
};

export class Form extends React.Component<{}, FormState> {
  state = {
    name: '',
    favoriteBeer: '',
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

  render() {
    return (
      <Card style={{margin: '32px 64px'}} className="beerForm">
        <CardHeader>Beer Info</CardHeader>
        <CardText>
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
        </CardText>
      </Card>
    );
  }
}

export default Form;
