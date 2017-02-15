export const LOGINFORM_ON_CHANGE = 'LOGINFORM_ON_CHANGE'
export const LOGINFORM_SUBMIT = 'LOGINFORM_SUBMIT'

export function loginFormOnChange(username) {
  return { type: LOGINFORM_ON_CHANGE, username: username }
}

export function
loginFormSubmit() {
  return { type: LOGINFORM_SUBMIT }
}
