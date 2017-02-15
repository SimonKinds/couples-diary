import {combineReducers} from 'redux'
import jwt from 'jsonwebtoken'

import {LOGIN_FAIL, LOGIN_SUCCESS, LOGINFORM_ON_CHANGE, LOGINFORM_SUBMIT} from './LoginActions'

const buildUserFromToken = token => {
  try {
    // we won't verify on client side, just decode
    // if the token is invalid the server should tell us so
    const decodedToken = jwt.decode(token)
    return {
      id: decodedToken.userId,
      username: decodedToken.username,
      coupleId: decodedToken.coupleId
    }
  } catch(err) {
    return {};
  }
}

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

function user(state = buildUserFromToken(localStorage.getItem('jwtToken')), action) {
  switch(action.type) {
    case LOGIN_SUCCESS:
      const token = action.token
      localStorage.setItem('jwtToken', token)
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
