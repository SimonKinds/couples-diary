import React from 'react';
import {LocalForm, Control} from 'react-redux-form';

export default class LoginForm extends React.Component {
  render() {
    return (<LocalForm
      onSubmit={values => this.handleSubmit(values)}>
      <label>Username</label>
      <Control.text model='.username'/>
    </LocalForm>);
  }


  handleSubmit(values) {
    alert(values.username);
  }
};
