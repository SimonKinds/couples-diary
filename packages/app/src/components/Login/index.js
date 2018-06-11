import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Login from './component';

export const LoginContainer = ({ setUser, history }) => (
  <Mutation
    mutation={gql`
      mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          id
          username
          name
        }
      }
    `}
    onCompleted={({ login: user }) => {
      if (user != null) {
        const { id, username, name } = user;
        setUser({ id, username, name });
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
  setUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default LoginContainer;
