import React, { PureComponent } from 'react';
import Router from '../Router';

import './styles.css';

class App extends PureComponent {
  state = {
    token: window.localStorage.getItem('token'),
  };

  setToken = token => {
    this.setState({ token });
    window.localStorage.setItem('token', token);
  };

  render() {
    return (
      <div className="container">
        <Router
          isLoggedIn={this.state.token != null}
          setToken={this.setToken}
        />
      </div>
    );
  }
}

export default App;
