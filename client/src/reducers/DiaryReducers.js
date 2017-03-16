import {
  DIARY_GET_MONTH,
  DIARY_GET_MONTH_SUCCESS,
  DIARY_GET_MONTH_FAIL
} from '../actions/DiaryActions';

function diary(state = { dates: {} }, action) {
  switch (action.type) {
    case DIARY_GET_MONTH:
      return {
        ...state,
        dates: updateIsFetching(action.year, action.month, true, state.dates)
      };
    case DIARY_GET_MONTH_SUCCESS:
    case DIARY_GET_MONTH_FAIL:
      return {
        ...state,
        dates: updateIsFetching(action.year, action.month, false, state.dates)
      };
    default:
      return state;
  }
}

function updateIsFetching(year, month, value, state) {
  let stateCopy = { ...state };
  if (!stateCopy[year]) {
    stateCopy[year] = {};
  }
  if (!stateCopy[year][month]) {
    stateCopy[year][month] = {};
  }
  stateCopy[year][month].isFetching = value;

  return stateCopy;
}

export default diary;
