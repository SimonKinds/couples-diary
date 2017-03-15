import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGINFORM_ON_CHANGE,
  LOGINFORM_SUBMIT
} from '../actions/LoginActions';

export function login(
  state = { loginError: false, ui: { username: '' } },
  action
) {
  switch (action.type) {
    case LOGINFORM_ON_CHANGE:
      return { ...state, ui: { username: action.username } };
    case LOGIN_FAIL:
      return { ...state, loginError: true };
    case LOGIN_SUCCESS:
      return { ...state, loginError: false };
    default:
      return state;
  }
}

export default login;
