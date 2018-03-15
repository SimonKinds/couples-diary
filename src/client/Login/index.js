// @flow

import React, { PureComponent } from 'react';
import Login from './component';

type Props = {};
type State = {
  didLoginSuccess: boolean
};

export default class LoginContainer extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      didLoginSuccess: false,
    };

    (this: any).onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  onLoginSubmit(username: string, password: string) {
    fetch('/api/login', {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.status)
      .then(status => this.setState({ didLoginSuccess: status === 200 }));
  }

  render() {
    if (this.state.didLoginSuccess) {
      return 'logged in!';
    }
    return <Login onSubmit={this.onLoginSubmit} />;
  }
}
