import {LOGIN_FAIL, LOGIN_SUCCESS, LOGINFORM_ON_CHANGE, LOGINFORM_SUBMIT} from './LoginActions'

const initialState = {
  username: ''
}

function loginForm(state = initialState, action) {
  switch (action.type) {
    case LOGINFORM_ON_CHANGE:
      return { username: action.username }
    case LOGIN_FAIL:
      console.log('Failed login')
      return { username: state.username }
    case LOGIN_SUCCESS:
      console.log('Successfull login')
      return { username: state.username }
    default:
      return state
  }
}

export default loginForm
