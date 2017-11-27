import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {teal500, teal700} from 'material-ui/styles/colors';
import {AppBar, Card, CardHeader, CardText} from 'material-ui';
import OldForm from './OldForm';
import NewForm from './NewForm';
import MaterialForm from './MaterialForm';
import './App.css';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: teal500,
    primary2Color: teal700,
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppBar />
          <Card className="beerForm">
            <CardHeader>Beer Info</CardHeader>
            <CardText>
              <div className="forms">
                <OldForm />
                <NewForm />
                <MaterialForm />
              </div>
            </CardText>
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
