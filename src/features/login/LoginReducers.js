import {combineReducers} from 'redux'
import {buildUserFromToken, setJwtToken} from '../../utils/jwt'

import {LOGIN_FAIL, LOGIN_SUCCESS, LOGINFORM_ON_CHANGE, LOGINFORM_SUBMIT} from './LoginActions'

function loginForm(state = {username: '', loginError: false}, action) {
  switch (action.type) {
    case LOGINFORM_ON_CHANGE:
      return Object.assign({}, state, {username: action.username})
    case LOGIN_FAIL:
      return Object.assign({}, state, {loginError: true})
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {loginError: false})
    default:
      return state
  }
}

function user(state = buildUserFromToken(), action) {
  switch(action.type) {
    case LOGIN_SUCCESS:
      const token = action.token
      setJwtToken(token)
      return buildUserFromToken(token)
    case LOGIN_FAIL:
      return {}
    default:
      return state
  }
}

const loginReducers = combineReducers({
  loginForm,
  user
})

export default loginReducers
