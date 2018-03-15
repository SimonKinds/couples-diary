// @flow

import React, { PureComponent } from 'react';
import Login from './component';

type Props = {
  setIsLoggedIn: (status: boolean) => void
};
type State = {};

export default class LoginContainer extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

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
      .then((status) => {
        if (status === 200) {
          this.props.setIsLoggedIn(true);
        }
      });
  }

  render() {
    return <Login onSubmit={this.onLoginSubmit} />;
  }
}
