import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import Input from './Input';
import SubmitButton from './SubmitButton';
import Loader from '../Loader';

import './styles.css';

const ErrorNotifier = ({ didFail }) => (
  <div style={{ marginTop: '20px', height: '1em', color: 'red' }}>
    {didFail && 'Error logging in'}
  </div>
);

export default class Login extends PureComponent {
  state = {
    username: '',
    password: '',
  };

  onUsernameChange = username => {
    this.setState({ username });
  };

  onPasswordChange = password => {
    this.setState({ password });
  };

  onSubmit = () => {
    this.props.onSubmit(this.state.username, this.state.password);
  };

  render() {
    return (
      <section>
        <div className="login">
          <h1>Login</h1>
          <Form onSubmit={this.onSubmit}>
            <Input
              id="username"
              type="text"
              label="Username"
              value={this.state.username}
              onChange={this.onUsernameChange}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
            <div style={{ display: 'flex', width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {this.props.isLoggingIn && <Loader />}
              </div>
              <SubmitButton id="login-button" value="Login" />
            </div>
          </Form>
          <ErrorNotifier didFail={this.props.didFail} />
        </div>
      </section>
    );
  }
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
  didFail: PropTypes.bool.isRequired,
};
