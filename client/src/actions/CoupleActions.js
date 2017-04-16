import fetch from 'node-fetch';

export const GET_COUPLE = 'GET_COUPLE';
export const GET_COUPLE_SUCCESS = 'GET_COUPLE_SUCCESS';
export const GET_COUPLE_FAIL = 'GET_COUPLE_FAIL';

export function getCouple(coupleId, token) {
  return dispatch => {
    dispatch({ type: GET_COUPLE });
    return fetch('http://couplesdiary.kindstrom.io/api/couple/' + coupleId, {
      headers: { Authorization: token }
    })
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error('Couple not found');
        }
      })
      .then(couple => {
        dispatch({ type: GET_COUPLE_SUCCESS, couple: couple });
      })
      .catch(e => dispatch({ type: GET_COUPLE_FAIL }));
  };
}
