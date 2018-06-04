// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<App />, root);
} else {
  // eslint-disable-next-line
  console.error('Could not find react root');
}

registerServiceWorker();
