import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Form from './Form';
import Input from './Input';
import SubmitButton from './SubmitButton';
import Loader from '../Loader';

import './styles.css';

export default class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

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
            <div style={{ display: 'flex' }}>
              <div>
                <SubmitButton id="login-button" value="Login" />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Loader active={this.props.isLoggingIn} />
              </div>
            </div>
          </Form>
        </div>
      </section>
    );
  }
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoggingIn: PropTypes.bool.isRequired,
};
