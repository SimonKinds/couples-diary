import fetch from 'node-fetch';
import { push } from 'react-router-redux';

import { setJwtToken, buildUserFromToken } from '../utils/jwt';
import { getCouple } from './CoupleActions';

export const LOGINFORM_ON_USERNAME_CHANGE = 'LOGINFORM_ON_USERNAME_CHANGE';
export const LOGINFORM_ON_PASSWORD_CHANGE = 'LOGINFORM_ON_PASSWORD_CHANGE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export function loginFormUsernameChange(username) {
  return { type: LOGINFORM_ON_USERNAME_CHANGE, username };
}

export function loginFormPasswordChange(password) {
  return { type: LOGINFORM_ON_PASSWORD_CHANGE, password };
}

function loginFormSubmit() {
  return { type: LOGINFORM_SUBMIT };
}

function loginSuccess(user) {
  return { type: LOGIN_SUCCESS, user };
}

function loginFail() {
  return { type: LOGIN_FAIL };
}

export function login(username, password) {
  return dispatch => {
    return fetch('http://couplesdiary.kindstrom.io/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password})
    })
      .then(response => {
        if (response.status == 200) {
          return response.text();
        } else {
          throw new Error();
        }
      })
      .then(token => {
        setJwtToken(token);
        const user = buildUserFromToken(token);
        dispatch(getCouple(user.coupleId, token));

        dispatch(loginSuccess(user));
        dispatch(push('/diary'));
      })
      .catch(err => {
        dispatch(loginFail());
      });
  };
}
