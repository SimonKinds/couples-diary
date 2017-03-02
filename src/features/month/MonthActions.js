export const MONTH_GET = "MONTH_GET"
export const MONTH_FETCHING = "MONTH_FETCHING"
export const MONTH_GET_SUCCESS = "MONTH_GET_SUCCESS"

export function monthGet(year, month) {
  return dispatch => {
    dispatch(monthGetSuccess(year, month,
      [{day: 1, year: year, month: month,  entries:
        [{name: 'simon', content: 'Today I\'ve been hiding from the rain', color: '#ff00ff'}]}, 
        {day: 20, year: year, month: month, entries:
          [{name: 'simon', content: 'Today I saw the puking lion', color: '#ff00ff'}]}]))
  }
}

function monthFetching(year, month) {
  return {type: MONTH_FETCHING, year: year, month: month}
}

function monthGetSuccess(year, month, days) {
  return {type: MONTH_GET_SUCCESS, year: year, month: month, days: days}
}
