import React from 'react';
import {LocalForm, Control} from 'react-redux-form';

export default class LoginForm extends React.Component {
  render() {
    return (
      <div>
        <LocalForm
          onSubmit={values => this.handleSubmit(values)}>
          <label>Username</label>
          <Control.text model='.username'/>
        </LocalForm>
        <button onClick={this.handleSubmit}>
          Login
        </button>
        <button onClick={this.routeToSignup}>
          Sign Up
        </button>
      </div>
    );
  }

  handleSubmit(values) {
    alert(values.username);
  }

  routeToSignup() {
    alert('I want to sign up');
  }
};
