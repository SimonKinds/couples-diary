// @flow
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import Router from '../Router';

import './styles.css';

type Props = {};
type State = {
  user: ?User,
};

class App extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
    };

    (this: any).setUser = this.setUser.bind(this);
  }

  setUser(user: ?User) {
    this.setState({ user });
  }

  render() {
    return (
      <div className="container">
        <Router user={this.state.user} setUser={this.setUser} />
      </div>
    );
  }
}

export default hot(module)(App);
