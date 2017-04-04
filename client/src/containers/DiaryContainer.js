import { connect } from 'react-redux';

import Diary from '../components/Diary';
import { diaryRouteMonth } from '../actions/DiaryActions';

function mapStateToProps(state) {
  return {
    year: state.diary.ui.year,
    month: state.diary.ui.month
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showPrevMonth: (year, month) => showPrevMonth(year, month, dispatch),
    showNextMonth: (year, month) => showNextMonth(year, month, dispatch)
  };
}

function showPrevMonth(year, month, dispatch) {
  let prevMonth = (month - 2) % 12 + 1;
  if (prevMonth == 0) prevMonth = 12;

  const shouldUpdateYear = prevMonth > month;

  dispatch(diaryRouteMonth(shouldUpdateYear ? year - 1 : year, prevMonth));
}

function showNextMonth(year, month, dispatch) {
  const nextMonth = month % 12 + 1;
  const shouldUpdateYear = month > nextMonth;

  dispatch(diaryRouteMonth(shouldUpdateYear ? year + 1 : year, nextMonth));
}

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
