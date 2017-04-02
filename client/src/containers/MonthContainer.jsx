import { connect } from 'react-redux';
import React from 'react';

import Month from '../components/Month';
import { diaryGetMonth, diaryRouteDate } from '../actions/DiaryActions';

class MonthContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getMonth(this.props.year, this.props.month);
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
  const year = state.diary.ui.selectedYear;
  const month = state.diary.ui.selectedMonth;

  const date = new Date();
  date.setYear(year);
  date.setMonth(month - 1);
  // 0 = last date of previous month
  date.setDate(1);
  return {
    startIndex: date.getDay() - 1,
    year: year,
    month: month,
    // long = full name
    monthName: date.toLocaleString('en-us', { month: 'long' }),
    days: days(state),
    isFetching: state.diary.fetching.indexOf({ year, month }) != -1
  };
}

function days(state) {
  const year = state.diary.ui.selectedYear;
  const month = state.diary.ui.selectedMonth;
  const daysInMonth = new Date(year, month, 0).getDate();

  let days = [];
  for (let dayIndex = 1; dayIndex <= daysInMonth; ++dayIndex) {
    days.push({ day: dayIndex, entries: [] });
  }

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
