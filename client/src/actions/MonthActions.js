import fetch from 'node-fetch';
import { getJwtToken, buildUserFromToken } from '../utils/jwt';

export const MONTH_GET = 'MONTH_GET';
export const MONTH_FETCHING = 'MONTH_FETCHING';
export const MONTH_GET_SUCCESS = 'MONTH_GET_SUCCESS';
export const MONTH_GET_FAIL = 'MONTH_GET_FAIL';

const ERROR_INVALID_USER = 'invalid user';

export function monthGet(year, month) {
  const token = getJwtToken();
  const user = buildUserFromToken(token);
  return dispatch => {
    if (!user) {
      throw new Error(ERROR_INVALID_USER);
    }

    dispatch(monthFetching(year, month));

    return fetch(
      'http://localhost:8080/api/diary/' +
        year +
        '/' +
        month +
        '?coupleId=' +
        user.coupleId,
      {
        headers: { Authorization: token }
      }
    )
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(days => dispatch(monthGetSuccess(year, month, days)))
      .catch(err => {
        dispatch(monthGetFail(year, month, err));
      });
  };
}

function monthFetching(year, month) {
  return { type: MONTH_FETCHING, year: year, month: month };
}

function monthGetSuccess(year, month, days) {
  return { type: MONTH_GET_SUCCESS, year: year, month: month, days: days };
}

function monthGetFail(year, month, error) {
  return { type: MONTH_GET_FAIL, year: year, month: month, error: error };
}
