export const LOGINFORM_ON_CHANGE = 'LOGINFORM_ON_CHANGE'
export const LOGINFORM_SUBMIT = 'LOGINFORM_SUBMIT'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'

export function loginFormOnChange(username) {
  return { type: LOGINFORM_ON_CHANGE, username: username }
}

function
loginFormSubmit() {
  return { type: LOGINFORM_SUBMIT }
}

function loginSuccess(token) {
  return { type: LOGIN_SUCCESS, token: token }
}

function
loginFail() {
  return { type: LOGIN_FAIL }
}

export function login(username) {
  return dispatch => {
    dispatch(loginFormSubmit())

    return dispatch(loginFail())
  }
}
