import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { getToken, logout } from './authentication';

const shouldIncludeAuthorizationHeader = token => token !== null;
const getAuthorizationHeader = token =>
  token !== null ? `Bearer ${token}` : null;

const client = new ApolloClient({
  uri: '/graphql',
  request: operation =>
    operation.setContext(
      shouldIncludeAuthorizationHeader(getToken())
        ? { headers: { Authorization: getAuthorizationHeader(getToken()) } }
        : null
    ),
  onError: ({ graphQLErrors }) => {
    if (
      graphQLErrors !== undefined &&
      graphQLErrors.find(
        ({ extensions: { code } }) => code === 'UNAUTHENTICATED'
      ) !== undefined
    ) {
      logout();
    }
  },
});

const root = document.getElementById('root');
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  root
);

registerServiceWorker();
