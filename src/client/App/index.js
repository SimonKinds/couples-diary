// @flow
import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import Login from '../Login';


import './styles.css';

class App extends PureComponent<{}> {
  render() {
    return (
      <div className="container">
        <Login />
      </div>
    );
  }
}

export default hot(module)(App);
