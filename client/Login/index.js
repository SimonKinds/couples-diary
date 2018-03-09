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
            <label htmlFor="email">
              Email
              <input id="email" type="email" />
            </label>
            <br />
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
