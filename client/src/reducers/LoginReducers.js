import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGINFORM_ON_USERNAME_CHANGE,
  LOGINFORM_ON_PASSWORD_CHANGE,
  LOGINFORM_SUBMIT
} from '../actions/LoginActions';

export function login(
  state = { loginError: false, ui: { username: '', password: '' } },
  action
) {
  switch (action.type) {
    case LOGINFORM_ON_USERNAME_CHANGE:
      return { ...state, ui: { ...state.ui, username: action.username } };
    case LOGINFORM_ON_PASSWORD_CHANGE:
      return { ...state, ui: { ...state.ui, password: action.password } };
    case LOGIN_FAIL:
      return { ...state, loginError: true };
    case LOGIN_SUCCESS:
      return { ...state, loginError: false };
    default:
      return state;
  }
}

export default login;
