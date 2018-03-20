// @flow
import React, { PureComponent } from 'react';
import Form from './Form';
import Input from './Input';
import SubmitButton from './SubmitButton';

import './styles.css';

type Props = {
  onSubmit: (username: string, password: string) => void,
};
type State = {
  username: string,
  password: string,
};

export default class Login extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };

    (this: any).onUsernameChange = this.onUsernameChange.bind(this);
    (this: any).onPasswordChange = this.onPasswordChange.bind(this);
    (this: any).onSubmit = this.onSubmit.bind(this);
  }

  onUsernameChange(username: string) {
    this.setState({ username });
  }

  onPasswordChange(password: string) {
    this.setState({ password });
  }

  onSubmit() {
    this.props.onSubmit(this.state.username, this.state.password);
  }

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
            <SubmitButton id="login-button" value="Login" />
          </Form>
        </div>
      </section>
    );
  }
}
