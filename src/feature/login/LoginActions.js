export const LOGINFORM_ON_CHANGE = 'LOGINFORM_ON_CHANGE'

export function loginFormOnChange(username) {
  return { type: LOGINFORM_ON_CHANGE, username: username }
}
