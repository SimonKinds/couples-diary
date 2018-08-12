import React, { PureComponent } from 'react';
import Router from '../Router';
import {
  isAuthenticated,
  subscribeToAuthenticationUpdates,
  unsubscribeFromAuthenticationUpdates,
} from '../../authentication';

import './styles.css';

class App extends PureComponent {
  state = {
    isAuthenticated: isAuthenticated(),
  };

  onAuthenticationStatusUpdate = isAuthenticated => {
    this.setState({ isAuthenticated });
  };

  componentDidMount() {
    subscribeToAuthenticationUpdates(this.onAuthenticationStatusUpdate);
  }

  componentWillUnmount() {
    unsubscribeFromAuthenticationUpdates(this.onAuthenticationStatusUpdate);
  }

  render() {
    return (
      <div className="container">
        <Router isAuthenticated={this.state.isAuthenticated} />
      </div>
    );
  }
}

export default App;
