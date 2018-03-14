// @flow
import React, { PureComponent } from 'react';

import './styles.css';

type State = {
  username: string,
  password: string
};

export default class Login extends PureComponent<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    (this: any).onUsernameChange = this.onUsernameChange.bind(this);
    (this: any).onPasswordChange = this.onPasswordChange.bind(this);
    (this: any).onSubmit = this.onSubmit.bind(this);
  }

  onUsernameChange(event: SyntheticEvent<HTMLInputElement>) {
    this.setState({ username: event.currentTarget.value });
  }

  onPasswordChange(event: SyntheticEvent<HTMLInputElement>) {
    this.setState({ password: event.currentTarget.value });
  }

  onSubmit(event: SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault();
    // eslint-disable-next-line
    alert(JSON.stringify(this.state));
  }

  render() {
    return (
      <section>
        <div className="login">
          <h1>Login</h1>
          <form onSubmit={this.onSubmit}>
            <label htmlFor="username">
              Username
              <input
                id="username"
                type="text"
                value={this.state.username}
                onChange={this.onUsernameChange}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                value={this.state.password}
                onChange={this.onPasswordChange}
              />
            </label>
            <input id="login-button" type="submit" value="Login" />
          </form>
        </div>
      </section>
    );
  }
}
