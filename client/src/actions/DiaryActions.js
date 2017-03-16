import { getJwtToken, buildUserFromToken } from '../utils/jwt';

export const DIARY_GET_MONTH = 'DIARY_GET_MONTH';
export const DIARY_GET_MONTH_SUCCESS = 'DIARY_GET_MONTH_SUCCESS';
export const DIARY_GET_MONTH_FAIL = 'DIARY_GET_MONTH_FAIL';

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
      .catch(err => dispatch(diaryGetMonthfail(year, month)));
  };
}

function diaryGetMonthSuccess(year, month, days) {
  return { type: DIARY_GET_MONTH_SUCCESS, year, month, days };
}

function diaryGetMonthFail(year, month) {
  return { type: DIARY_GET_MONTH_FAIL, year, month };
}
