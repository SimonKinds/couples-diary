import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: '/',
});

const root = document.getElementById('root');
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  root
);

registerServiceWorker();
