import React from 'react';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.username = '';

    this.onLogin = this.onLogin.bind(this);
    this.onSignup = this.onSignup.bind(this);
  }

  render() {
    return (
      <div>
        <form
          onSubmit={this.onLogin}>
          <label>Username</label>
          <input type="text" value={this.username}/>
        </form>
        <button onClick={this.onLogin}>
          Login
        </button>
        <button onClick={this.onSignup}>
          Sign Up
        </button>
      </div>
    );
  }

  onLogin() {
    this.props.onLogin(this.username);
  }

  onSignup() {
    this.props.onSignup(this.username);
  }
};
