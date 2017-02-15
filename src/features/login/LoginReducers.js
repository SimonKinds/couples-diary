import {LOGINFORM_ON_CHANGE} from './LoginActions'

const initialState = {
  username: ''
}

function loginForm(state = initialState, action) {
  switch (action.type) {
    case LOGINFORM_ON_CHANGE:
      return { username: action.username }
    default:
      return state
  }
}

export default loginForm
