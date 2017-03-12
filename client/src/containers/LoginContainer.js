import { connect } from 'react-redux';

import Login from '../components/Login';
import { loginFormOnChange, login } from '../actions/LoginActions';

function mapStateToProps(state) {
  return {
    username: state.login.ui.username,
    loginError: state.login.loginError
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUsernameChange: event => {
      dispatch(loginFormOnChange(event.target.value));
    },
    onSubmit: username => {
      dispatch(login(username));
    }
  };
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;
