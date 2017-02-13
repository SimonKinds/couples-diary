import React from 'react';
import fetch from 'node-fetch';
import LoginForm from '../components/LoginForm';

export default class LoginFormContainer extends React.Component {

  render() {
    return <LoginForm onLogin={this.onLogin} onSignup={this.onSignup}/>
  }

  onLogin() {
    fetch('http://api.localhost:8080', {mode: 'cors'})
      .then((response) => {
        alert('Got a response');
      })
      .catch((err) => console.error(err.message));
  }

  onSignup() {
    alert('Tried to sign up!');
  }
};
