import {
  DIARY_GET_MONTH,
  DIARY_GET_MONTH_SUCCESS,
  DIARY_GET_MONTH_FAIL
} from '../actions/DiaryActions';

function defaultDates() {
  const year = new Date().getFullYear();
  const dates = {};
  dates[year] = {};
  for (let month = 0; month < 12; ++month) {
    // set to last day of current month
    let date = new Date(year, month + 1, 0);
    dates[year][month] = { isFetching: false };
    // set to last date, so loop through all days
    for (let day = 0; day < date.getDate(); ++day) {
      dates[year][month][day] = { entries: [] };
    }
  }
  return dates;
}

function diary(
  state = {
    entries: {},
    dates: defaultDates(),
    ui: {
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth()
    }
  },
  action
) {
  switch (action.type) {
    case DIARY_GET_MONTH:
      return {
        ...state,
        dates: updateIsFetching(action.year, action.month, true, state.dates)
      };
    case DIARY_GET_MONTH_FAIL:
      return {
        ...state,
        dates: updateIsFetching(action.year, action.month, false, state.dates)
      };
    case DIARY_GET_MONTH_SUCCESS:
      return {
        ...state,
        entries: transformToEntriesMap(action.days),
        dates: updateDates(action.year, action.month, action.days, state.dates)
      };
    default:
      return state;
  }
}

function updateDates(year, month, days, dates) {
  let datesCopy = { ...dates };
  datesCopy[year][month].isFetching = false;
  for (const day of days) {
    let entryIds = [];
    for (const entry of day.entries) {
      entryIds.push(entry._id);
    }
    // currenty zero-indexed locally but not remotely
    datesCopy[year][month][day.day - 1].entries = entryIds;
  }
  return datesCopy;
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

function transformToEntriesMap(days) {
  let entries = {};
  for (const day of days) {
    for (const entry of day.entries) {
      entries[entry._id] = {
        user: entry.user,
        text: entry.text
      };
    }
  }
  return entries;
}

export default diary;
