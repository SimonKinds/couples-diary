import {
  DIARY_GET_MONTH,
  DIARY_GET_MONTH_SUCCESS,
  DIARY_GET_MONTH_FAIL,
  DIARY_SHOW_DATE,
  ENTRY_ON_EDIT_MODE_CLICKED,
  ENTRY_ON_CHANGE,
  ENTRY_ON_SAVE_SUCCESS,
  ENTRY_ON_SAVE_FAIL
} from '../actions/DiaryActions';

import { URL_CHANGE } from '../actions/UrlActions';

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
    },
    date: {}
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
    case DIARY_SHOW_DATE:
      const { year, month, day } = action;
      return {
        ...state,
        date: {
          year: year,
          month: month,
          day: day,
          isDirty: false,
          ui: {
            isInEditMode: true
          }
        }
      };
    case URL_CHANGE:
      const { path } = action;
      const matches = path.match(/^\/diary\/(\d+)\/(\d+)\/(\d+)$/);
      if (matches) {
        const year = matches[1];
        const month = matches[2];
        const day = matches[3];

        return {
          ...state,
          date: {
            year: year,
            month: month,
            day: day,
            isDirty: false,
            ui: {
              isInEditMode: false
            }
          }
        };
      } else {
        return state;
      }
    case ENTRY_ON_EDIT_MODE_CLICKED:
      return {
        ...state,
        date: {
          ...state.date,
          ui: {
            ...state.date.ui,
            isInEditMode: !state.date.ui.isInEditMode
          }
        }
      };
    case ENTRY_ON_CHANGE:
      return {
        ...state,
        date: {
          ...state.date,
          ui: {
            isInEditMode: true,
            updatedText: action.text
          }
        }
      };
    case ENTRY_ON_SAVE_SUCCESS:
      const days = [action.day];
      return {
        ...state,
        entries: transformToEntriesMap(days),
        dates: updateDates(
          action.day.year,
          action.day.month,
          days,
          state.dates
        ),
        date: {
          ...state.date,
          savedError: false,
          ui: {
            ...state.date.ui,
            isInEditMode: false
          }
        }
      };
    case ENTRY_ON_SAVE_FAIL:
      return {
        ...state,
        date: {
          ...state.date,
          savedError: true
        }
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
