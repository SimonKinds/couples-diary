import { combineReducers } from 'redux';
import { buildUserFromToken, setJwtToken } from '../../utils/jwt';

import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGINFORM_ON_CHANGE,
  LOGINFORM_SUBMIT
} from './LoginActions';

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

export function user(state = buildUserFromToken(), action) {
  if (!state) state = {};
  switch (action.type) {
    case LOGIN_SUCCESS:
      const token = action.token;
      setJwtToken(token);
      return buildUserFromToken(token);
    case LOGIN_FAIL:
      return {};
    default:
      return state;
  }
}
