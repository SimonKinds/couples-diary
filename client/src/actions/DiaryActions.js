import { push } from 'react-router-redux';

import { getJwtToken, buildUserFromToken } from '../utils/jwt';

export const DIARY_GET_MONTH = 'DIARY_GET_MONTH';
export const DIARY_GET_MONTH_SUCCESS = 'DIARY_GET_MONTH_SUCCESS';
export const DIARY_GET_MONTH_FAIL = 'DIARY_GET_MONTH_FAIL';
export const DIARY_SHOW_DATE = 'DIARY_SHOW_DATE';

export const ENTRY_ON_CHANGE = 'ENTRY_ONCHANGE';
export const ENTRY_ON_EDIT_MODE_CLICKED = 'ENTRY_ON_EDIT_MODE_CLICKED';
export const ENTRY_ON_SAVE = 'ENTRY_ON_SAVE';
export const ENTRY_ON_SAVE_FAIL = 'ENTRY_ON_SAVE_FAIL';
export const ENTRY_ON_SAVE_SUCCESS = 'ENTRY_ON_SAVE_SUCCESS';

export function diaryGetMonth(year, month) {
  const token = getJwtToken();
  const coupleId = buildUserFromToken(token).coupleId;
  return dispatch => {
    dispatch({ type: DIARY_GET_MONTH, year, month });
    const url = 'http://localhost:8080/api/diary/' +
      year +
      '/' +
      month +
      '?coupleId=' +
      coupleId;
    return fetch(url, { headers: { Authorization: token } })
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(days => dispatch(diaryGetMonthSuccess(year, month, days)))
      .catch(err => dispatch(diaryGetMonthFail(year, month)));
  };
}

function diaryGetMonthSuccess(year, month, days) {
  return { type: DIARY_GET_MONTH_SUCCESS, year, month, days };
}

function diaryGetMonthFail(year, month) {
  return { type: DIARY_GET_MONTH_FAIL, year, month };
}

export function diaryShowDate(year, month, day) {
  return dispatch => {
    dispatch({ type: DIARY_SHOW_DATE, year, month, day });
    dispatch(push('/diary/' + year + '/' + month + '/' + day));
  };
}

export function entryOnChange(text) {
  return { type: ENTRY_ON_CHANGE, text };
}

export function entryOnEditModeClicked() {
  return { type: ENTRY_ON_EDIT_MODE_CLICKED };
}

export function entryOnSave(year, month, day, text) {
  return (dispatch, getState) => {
    dispatch({ type: ENTRY_ON_SAVE });
    const { couple } = getState();

    const url = 'http://localhost:8080/api/diary/create';
    const headers = {
      Authorization: getJwtToken()
    };
    const body = {
      couple: couple.id,
      user: user.thisUser,
      year,
      month,
      day,
      text
    };

    return fetch(url, {
      method: 'post',
      headers,
      body
    })
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(day => {
        dispatch({ type: ENTRY_ON_SAVE_SUCCESS, day });
      })
      .catch(e => {
        dispatch({ type: ENTRY_ON_SAVE_FAIL });
      });
  };
}
