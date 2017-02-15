import {connect} from 'react-redux'

import LoginForm from './LoginForm'
import {loginFormOnChange, loginFormSubmit} from './LoginActions'

const mapStateToProps = state => {
  return {
    username: state.username
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUsernameChange: event => {
      dispatch(loginFormOnChange(event.target.value))
    },
    onSubmit: event => {
      event.preventDefault()
      dispatch(loginFormSubmit())
    }
  }
}

const LoginFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)

export default LoginFormContainer
