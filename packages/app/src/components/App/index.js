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
    return <Router isAuthenticated={this.state.isAuthenticated} />;
  }
}

export default App;
