// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

const render = (Component) => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      root,
    );
  } else {
    // eslint-disable-next-line
    console.error('Could not find react root');
  }
};

render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  // $FlowFixMe
  module.hot.accept('./App', () => {
    render(App);
  });
}
