// @flow

import React, { PureComponent } from 'react';
import type { RouterHistory } from 'react-router-dom';

import makeCancelable from '../../make-cancelable';

import Login from './component';

type Props = {
  setUser: (user: ?User) => void,
  history: RouterHistory,
};
type State = {
  isLoggingIn: boolean,
};

export default class LoginContainer extends PureComponent<Props, State> {
  loginFetch: ?CancelablePromise<Response>;

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoggingIn: false,
    };

    this.loginFetch = null;
    (this: any).onLoginSubmit = this.onLoginSubmit.bind(this);
  }

  componentWillUnmount() {
    if (this.loginFetch) {
      this.loginFetch.cancel();
    }
  }

  onLoginSubmit(username: string, password: string) {
    this.setState({ isLoggingIn: true });
    this.login(username, password);
  }

  login(username: string, password: string) {
    this.loginFetch = makeCancelable(
      fetch('/api/login', {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    );

    this.loginFetch.promise
      .then(response => Promise.all([response.status, response.json()]))
      .then(([status, user]) => {
        this.finishApiCall();
        if (status === 200) {
          const { history, setUser } = this.props;
          // TODO: parse User
          setUser(user);
          history.push('/');
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
