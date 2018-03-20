// @flow

import React, { PureComponent } from 'react';
import Login from './component';

type Props = {
  setIsLoggedIn: (status: boolean) => void,
};
type State = {
  isLoggingIn: boolean,
};

export default class LoginContainer extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoggingIn: false,
    };

    (this: any).onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  onLoginSubmit(username: string, password: string) {
    this.setState({ isLoggingIn: true });
    fetch('/api/login', {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.status)
      .then((status) => {
        this.finishApiCall();
        if (status === 200) {
          this.props.setIsLoggedIn(true);
        }
      })
      .catch(() => this.finishApiCall());
  }

  finishApiCall() {
    this.setState({ isLoggingIn: false });
  }

  render() {
    return (
      <Login
        onSubmit={this.onLoginSubmit}
        isLoggingIn={this.state.isLoggingIn}
      />
    );
  }
}
