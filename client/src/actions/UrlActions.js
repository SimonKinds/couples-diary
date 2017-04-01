import { diaryShowDate } from './DiaryActions';

const URL_CHANGE = 'URL_CHANGE';

export function onUrlChange(path) {
  return (dispatch, getState) => matchDiaryDate(path, dispatch, getState());
}

function matchDiaryDate(path, dispatch, state) {
  const matches = path.match(/^\/diary\/(\d+)\/(\d+)\/(\d+)$/);

  if (matches) {
    const year = matches[1];
    const month = matches[2];
    const day = matches[3];

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
