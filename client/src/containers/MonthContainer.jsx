import { connect } from 'react-redux';
import React from 'react';

import Month from '../components/Month';
import { diaryGetMonth, diaryRouteDate } from '../actions/DiaryActions';

class MonthContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isFetching) {
      return <div>loading...</div>;
    }
    return (
      <Month
        startIndex={this.props.startIndex}
        monthName={this.props.monthName}
        days={this.props.days}
        onClick={day =>
          this.props.onClick(this.props.year, this.props.month, day)}
      />
    );
  }
}

function mapStateToProps(state) {
  const year = state.diary.ui.year;
  const month = state.diary.ui.month;

  const date = new Date();
  date.setYear(year);
  date.setMonth(month - 1);
  // 0 = last date of previous month
  date.setDate(1);

  const isFetching = _.some(state.diary.fetching, { year, month }) ||
    !_.some(state.diary.fetched, { year, month });

  return {
    // make sure it's in the range [0, 6]
    startIndex: ((date.getDay() - 1) % 7 + 7) % 7,
    year: year,
    month: month,
    // long = full name
    monthName: date.toLocaleString('en-us', { month: 'long' }),
    days: days(state),
    isFetching
  };
}

function days(state) {
  const year = state.diary.ui.year;
  const month = state.diary.ui.month;
  const daysInMonth = new Date(year, month, 0).getDate();

  let days = [];
  for (let dayIndex = 1; dayIndex <= daysInMonth; ++dayIndex) {
    days.push({ day: dayIndex, entries: [] });
  }

  if (_.isEmpty(state.couple) || _.isEmpty(state.users)) return days;

  for (const date of state.diary.dates.filter(
    date => date.year == year && date.month == month
  )) {
    for (const entryId of date.entries) {
      const entry = state.diary.entries[entryId];
      const user = state.users[entry.user];

      days[date.day - 1].entries.push({
        name: user.username,
        color: user.color,
        text: entry.text
      });
    }
  }

  return days;
}

function mapDispatchToProps(dispatch) {
  return {
    getMonth: (year, month) => dispatch(diaryGetMonth(year, month)),
    onClick: (year, month, day) => dispatch(diaryRouteDate(year, month, day))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthContainer);
