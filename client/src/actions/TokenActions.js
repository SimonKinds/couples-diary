import fetch from 'node-fetch';
import { push } from 'react-router-redux';

import { setJwtToken, buildUserFromToken } from '../utils/jwt';
import { getCouple } from './CoupleActions';

export function renewToken(token) {
  return dispatch => {
    return fetch('http://couplesdiary.kindstrom.io/api/token/renew', {
      method: 'POST',
      headers: { 'Authorization': token },
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
      })
      .catch(err => {
        dispatch(renewFail());
      });
  };
}

function renewFail() {
  (dispatch, getState) => {
    const state = getState();
  }
}
