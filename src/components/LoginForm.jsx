import React from 'react';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: ''};

    this.onLogin = this.onLogin.bind(this);
    this.onSignup = this.onSignup.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.shouldShowLoginError = this.shouldShowLoginError.bind(this);
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.onLogin}>
          <label>Username</label>
          <input type="text" value={this.state.username} onChange={this.onUsernameChange}/>
        </form>
        <div>{this.shouldShowLoginError(this.props.loginError)}</div>
        <button onClick={this.onLogin}>
          Login
        </button>
        <button onClick={this.onSignup}>
          Sign Up
        </button>
      </div>
    );
  }

  onLogin(event) {
    if (event) event.preventDefault();
    this.props.onLogin(this.state.username);
  }

  onSignup() {
    this.props.onSignup(this.state.username);
  }

  onUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  shouldShowLoginError(isLogInError) {
    if (isLogInError) {
      return 'Error logging in';
    }
    return '';
  }
};
