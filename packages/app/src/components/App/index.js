import React, { PureComponent } from 'react';
import Router from '../Router';

import './styles.css';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.setUser = this.setUser.bind(this);
  }

  setUser(user) {
    this.setState({ user });
  }

  render() {
    return (
      <div className="container">
        <Router user={this.state.user} setUser={this.setUser} />
      </div>
    );
  }
}

export default App;
