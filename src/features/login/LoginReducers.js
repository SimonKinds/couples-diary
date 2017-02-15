import {LOGINFORM_ON_CHANGE, LOGINFORM_SUBMIT} from './LoginActions'

const initialState = {
  username: ''
}

function loginForm(state = initialState, action) {
  switch (action.type) {
    case LOGINFORM_ON_CHANGE:
      return { username: action.username }
    case LOGINFORM_SUBMIT:
      return { username: state.username + 'SUBMITTED' }
    default:
      return state
  }
}

export default loginForm
