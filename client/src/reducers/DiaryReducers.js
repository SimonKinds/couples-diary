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

function diary(
  state = {
    entries: {},
    dates: [],
    fetching: [],
    fetched: [],
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
    case DIARY_GET_MONTH: {
      const { year, month } = action;
      return {
        ...state,
        fetching: state.fetching.concat({ year, month })
      };
    }
    case DIARY_GET_MONTH_FAIL: {
      const { year, month } = action;
      return {
        ...state,
        fetching: state.fetching.filter(e => e == { year, month })
      };
    }
    case DIARY_GET_MONTH_SUCCESS: {
      const { year, month, days } = action;

      const dates = days.map(day => {
        return {
          ...day,
          entries: day.entries.map(entry => entry._id)
        };
      });

      let entries = { ...state.entries };
      for (const day of days) {
        for (const entry of day.entries) {
          entries[entry._id] = { user: entry.user, text: entry.text };
        }
      }

      return {
        ...state,
        entries,
        dates: state.dates.concat(dates),
        fetching: state.fetching.filter(e => e == { year, month }),
        fetched: state.fetched.concat({year, month})
      };
    }
    case DIARY_SHOW_DATE: {
      const { year, month, day, user } = action;

      const dateEntries = state.dates
        .filter(
          date => date.year == year && date.month == month && date.day == day
        )
        .map(date => date.entries);

      const thisUserEntry = dateEntries.filter(e => e.user == user);
      const otherUserEntry = dateEntries.filter(e => e.user != user);

      return {
        ...state,
        date: {
          year: year,
          month: month,
          day: day,
          thisUserEntry,
          otherUserEntry,
          saveError: false,
          ui: {
            isInEditMode: false
          }
        }
      };
    }
    case ENTRY_ON_EDIT_MODE_CLICKED: {
      const { year, month, day, thisUserEntryId } = state.date;
      const { user } = action;
      const thisUserEntry = state.entries[thisUserEntryId] || { text: '' };

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
      const dates = { ...state.dates };

      // only add if not update
      if (!entries[entry._id]) {
        dates.push({ year, month, day, entries: [entry] });
      }

      entries[entry._id] = {
        user: entry.user,
        text: entry.text
      };

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

export default diary;
