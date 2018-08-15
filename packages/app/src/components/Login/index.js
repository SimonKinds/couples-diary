import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Login from './component';
import { login } from '../../authentication';

export const LoginContainer = ({ history }) => (
  <Mutation
    mutation={gql`
      mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password)
      }
    `}
    onCompleted={({ login: token }) => {
      if (token !== null) {
        login(token);
        history.push('/');
      }
    }}
  >
    {(loginMutation, { loading, data, error }) => (
      <Login
        onSubmit={(username, password) =>
          loginMutation({ variables: { username, password } })
        }
        isLoggingIn={loading}
        didFail={
          error !== undefined ||
          (loading === false && (data && data.login) === null)
        }
      />
    )}
  </Mutation>
);

LoginContainer.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LoginContainer;
