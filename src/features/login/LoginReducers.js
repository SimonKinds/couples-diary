import {LOGIN_FAIL, LOGIN_SUCCESS, LOGINFORM_ON_CHANGE, LOGINFORM_SUBMIT} from './LoginActions'

const initialState = {
  username: ''
}

function loginForm(state = initialState, action) {
  switch (action.type) {
    case LOGINFORM_ON_CHANGE:
      return { username: action.username }
    case LOGINFORM_SUBMIT:
      return { username: state.username + 'SUBMITTED' }
    case LOGIN_FAIL:
      return { username: state.username + 'FAIL' }
    case LOGIN_SUCCESS:
      return { username: state.username + 'SUCCESS' }
    default:
      return state
  }
}

export default loginForm
