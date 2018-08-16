import React, { Fragment, PureComponent } from 'react';
import Router from '../Router';
import Header from '../Header';
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
      <Fragment>
        <Header />
        <Router isAuthenticated={this.state.isAuthenticated} />
      </Fragment>
    );
  }
}

export default App;
