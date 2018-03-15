// @flow
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import Login from '../Login';
import Calendar from '../Calendar';


import './styles.css';

type Props = {}
type State = {
  isLoggedIn: boolean
}

class App extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoggedIn: false,
    };

    (this: any).setIsLoggedIn = this.setIsLoggedIn.bind(this);
  }

  setIsLoggedIn(status: boolean) {
    this.setState({ isLoggedIn: status });
  }

  render() {
    return (
      <div className="container">
        {this.state.isLoggedIn ?
          <Calendar /> :
          <Login setIsLoggedIn={this.setIsLoggedIn} />}
      </div>
    );
  }
}

export default hot(module)(App);
