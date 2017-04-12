import { connect } from 'react-redux';

import Login from '../components/Login';
import {
  loginFormUsernameChange,
  loginFormPasswordChange,
  login
} from '../actions/LoginActions';

function mapStateToProps(state) {
  return {
    username: state.login.ui.username,
    password: state.login.ui.password,
    loginError: state.login.loginError
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUsernameChange: username => {
      dispatch(loginFormUsernameChange(username));
    },
    onPasswordChange: password => {
      dispatch(loginFormPasswordChange(password));
    },
    onSubmit: (username, password) => {
      dispatch(login(username, password));
    }
  };
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;
