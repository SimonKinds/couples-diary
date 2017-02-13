import React from 'react';
import fetch from 'node-fetch';
import LoginForm from '../components/LoginForm';

export default class LoginFormContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loginError: false};

    this.onLogin = this.onLogin.bind(this);
  }

  render() {
    return <LoginForm onLogin={this.onLogin} onSignup={this.onSignup} loginError={this.state.loginError}/>
  }

  onLogin(username) {
    fetch('http://api.localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    })
      .then((response) => {
        return response.text();
      })
      .then(token => {
        if(token) {
          this.setState({loginError: false});
          alert('I should now login');
        } else {
          this.setState({loginError: true});
        }
      })
      .catch((err) => console.error(err.message));
  }

  onSignup(username) {
    alert('Tried to sign up with username ' + username + '!');
  }
};
