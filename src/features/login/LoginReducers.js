import {LOGIN_FAIL, LOGIN_SUCCESS, LOGINFORM_ON_CHANGE, LOGINFORM_SUBMIT} from './LoginActions'

const initialState = {
  username: '',
  loginError: false
}

function loginForm(state = initialState, action) {
  switch (action.type) {
    case LOGINFORM_ON_CHANGE:
      return Object.assign({}, state, {username: action.username})
    case LOGIN_FAIL:
      return Object.assign({}, state, {loginError: true })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {loginError: false })
    default:
      return state
  }
}

export default loginForm
