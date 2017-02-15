import {connect} from 'react-redux'

import LoginForm from './LoginForm'
import {loginFormOnChange, login} from './LoginActions'

const mapStateToProps = state => {
  return {
    username: state.username,
    loginError: state.loginError
  }
}

const mapDispatchToProps = dispatch => {
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
