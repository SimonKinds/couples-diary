import { diaryShowMonth, diaryShowDate } from './DiaryActions';

const URL_CHANGE = 'URL_CHANGE';

export function onUrlChange(path) {
  return (dispatch, getState) => matchOnUrl(path, dispatch, getState());
}

function matchOnUrl(path, dispatch, state) {
  if (matchDiaryMonth(path, dispatch, state)) return;
  matchDiaryDate(path, dispatch, state);
}

function matchDiaryMonth(path, dispatch, state) {
  if (path == '/diary' || path == '/diary/') {
    const year = parseInt(state.diary.ui.year);
    const month = parseInt(state.diary.ui.month);

    dispatch(diaryShowMonth(year, month));
  }
  const matches = path.match(/^\/diary\/(\d+)\/(\d+)/);

  if (matches) {
    const year = parseInt(matches[1]);
    const month = parseInt(matches[2]);

    if (
      state.diary.ui.year == year &&
      state.diary.ui.month == month
    ) {
      return;
    }

    dispatch(diaryShowMonth(year, month));
  }
}

function matchDiaryDate(path, dispatch, state) {
  const matches = path.match(/^\/diary\/(\d+)\/(\d+)\/(\d+)$/);

  if (matches) {
    const year = parseInt(matches[1]);
    const month = parseInt(matches[2]);
    const day = parseInt(matches[3]);

    if (
      state.diary.date.year == year &&
      state.diary.date.month == month &&
      state.diary.date.day == day
    ) {
      return;
    }

    const { couple } = state;

    dispatch(diaryShowDate(year, month, day, couple.thisUser));
  }
}
