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
  for (let month = 1; month <= 12; ++month) {
    // set to last day of current month
    let date = new Date(year, month, 0);
    dates[year][month] = { isFetching: false, isFetched: false };
    // set to last date, so loop through all days
    for (let day = 1; day <= date.getDate(); ++day) {
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
      // javacript 0-indexes, I don't
      selectedMonth: new Date().getMonth() + 1
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
      const { year, month, day, user } = action;

      return {
        ...state,
        date: {
          year: year,
          month: month,
          day: day,
          saveError: false,
          ui: {
            isInEditMode: false
          }
        }
      };
    case ENTRY_ON_EDIT_MODE_CLICKED: {
      const { year, month, day } = state.date;
      const { user } = action;
      const thisUserEntry = state.dates[year][month][day].entries
        .map(entryId => state.entries[entryId])
        .filter(entry => entry.user == user)[0] || { text: '' };

      // set the updated text to the current value if it's empty
      const updatedText = state.ui.updatedText || thisUserEntry.text;
      return {
        ...state,
        date: {
          ...state.date,
          ui: {
            ...state.date.ui,
            isInEditMode: !state.date.ui.isInEditMode,
            updatedText: updatedText
          }
        }
      };
    }
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
    case ENTRY_ON_SAVE_SUCCESS: {
      const { year, month, day, entry } = action;

      const entries = { ...state.entries };
      entries[entry._id] = {
        user: entry.user,
        text: entry.text
      };

      const dates = { ...state.dates };
      // add only newly created, and not update
      const dateEntries = dates[year][month][day].entries;
      if (dateEntries.indexOf(entry._id) == -1) {
        dateEntries.push(entry._id);
      }

      return {
        ...state,
        entries,
        dates,
        date: {
          ...state.date,
          saveError: false,
          ui: {
            ...state.date.ui,
            isInEditMode: false
          }
        }
      };
    }
    case ENTRY_ON_SAVE_FAIL:
      return {
        ...state,
        date: {
          ...state.date,
          saveError: true
        }
      };
    default:
      return state;
  }
}

function updateDates(year, month, days, dates) {
  let datesCopy = { ...dates };
  datesCopy[year][month].isFetching = false;
  datesCopy[year][month].isFetched = true;
  for (const day of days) {
    let entryIds = [];
    for (const entry of day.entries) {
      entryIds.push(entry._id);
    }
    // currenty zero-indexed locally but not remotely
    datesCopy[year][month][day.day].entries = entryIds;
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
