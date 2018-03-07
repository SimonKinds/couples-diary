import React, { PureComponent } from "react";
import Login from '../Login';

import "./styles.css";

export default class App extends PureComponent {
  render() {
    return (
      <div className="container">
        <Login />
      </div>
    );
  }
}
