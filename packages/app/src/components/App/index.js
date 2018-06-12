import React, { PureComponent } from 'react';
import Router from '../Router';

import './styles.css';

class App extends PureComponent {
  state = {
    user: JSON.parse(window.localStorage.getItem('user')),
  };

  setUser = user => {
    this.setState({ user });
    window.localStorage.setItem('user', JSON.stringify(user));
  };

  render() {
    return (
      <div className="container">
        <Router user={this.state.user} setUser={this.setUser} />
      </div>
    );
  }
}

export default App;
