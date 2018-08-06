import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Login from './component';

export const LoginContainer = ({ setToken, history }) => (
  <Mutation
    mutation={gql`
      mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)
      }
    `}
    onCompleted={({ login: token }) => {
      if (token != null) {
        setToken(token);
        history.push('/');
      }
    }}
  >
    {(login, { loading }) => (
      <Login
        onSubmit={(username, password) =>
          login({ variables: { username, password } })
        }
        isLoggingIn={loading}
      />
    )}
  </Mutation>
);

LoginContainer.propTypes = {
  setToken: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default LoginContainer;
