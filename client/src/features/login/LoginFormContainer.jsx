import {connect} from 'react-redux'

import LoginForm from './LoginForm'
import {loginFormOnChange, login} from './LoginActions'

function mapStateToProps(state) {
  return {
    username: state.loginForm.username,
    loginError: state.loginForm.loginError
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onUsernameChange: event => {
      dispatch(loginFormOnChange(event.target.value))
    },
    onSubmit: (username) => {
      dispatch(login(username))
    }
  }
}

const LoginFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)

export default LoginFormContainer
