// @flow
import React, { PureComponent } from 'react';

import './styles.css';

export default class App extends PureComponent<{}> {
  render() {
    return (
      <section>
        <div className="login">
          <h1>Login</h1>
          <form>
            <label htmlFor="username">
              Username
              <input id="username" type="text" />
            </label>
            <label htmlFor="password">
              Password
              <input id="password" type="password" />
            </label>
            <input id="login-button" type="submit" value="Login" />
          </form>
        </div>
      </section>
    );
  }
}
