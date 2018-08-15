import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { getToken } from './authentication';

const shouldIncludeAuthorizationHeader = token => token !== null;
const getAuthorizationHeader = token =>
  token !== null ? `Bearer ${token}` : null;

const client = new ApolloClient({
  uri: '/',
  request: operation =>
    operation.setContext(
      shouldIncludeAuthorizationHeader(getToken())
        ? { headers: { Authorization: getAuthorizationHeader(getToken()) } }
        : null
    ),
});

const root = document.getElementById('root');
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  root
);

registerServiceWorker();
