import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import makeCancelable from '../../make-cancelable';

import Login from './component';

export default class LoginContainer extends PureComponent {
  state = {
    isLoggingIn: false,
  };
  cancelableLoginFetch = null;

  componentWillUnmount() {
    if (this.cancelableLoginFetch) {
      this.cancelableLoginFetch.cancel();
    }
  }

  onLoginSubmit = (username, password) => {
    this.setState({ isLoggingIn: true });
    this.login(username, password);
  };

  login = (username, password) => {
    this.cancelableLoginFetch = makeCancelable(
      fetch('/api/user/login', {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
    );

    this.cancelableLoginFetch.promise
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
  };

  finishApiCall = () => {
    this.setState({ isLoggingIn: false });
  };

  render() {
    return (
      <Login
        onSubmit={this.onLoginSubmit}
        isLoggingIn={this.state.isLoggingIn}
      />
    );
  }
}

LoginContainer.propTypes = {
  setUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};
