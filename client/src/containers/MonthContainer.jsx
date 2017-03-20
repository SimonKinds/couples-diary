import { connect } from 'react-redux';
import React from 'react';

import Month from '../components/Month';
import { diaryGetMonth, diaryShowDate } from '../actions/DiaryActions';

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
        //decrement by one to have 0-indexed
          this.props.onClick(this.props.year, this.props.month, day - 1)}
      />
    );
  }
}

function mapStateToProps(state) {
  const year = state.diary.ui.selectedYear;
  const month = state.diary.ui.selectedMonth;

  const date = new Date();
  date.setYear(year);
  date.setMonth(month);
  // 0 = last date of previous month
  date.setDate(1);
  return {
    startIndex: date.getDay() - 1,
    year: year,
    month: month,
    // long = full name
    monthName: date.toLocaleString('en-us', { month: 'long' }),
    days: days(state),
    isFetching: state.diary.dates[year][month].isFetching
  };
}

function days(state) {
  const year = state.diary.ui.selectedYear;
  const month = state.diary.ui.selectedMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let days = [];
  for (let dayIndex = 0; dayIndex < daysInMonth; ++dayIndex) {
    days.push({ day: dayIndex + 1, entries: [] });
  }

  for (const prop in state.diary.dates[year][month]) {
    if (prop == 'isFetching') continue;

    const dayIndex = prop;
    for (const entryId of state.diary.dates[year][month][dayIndex].entries) {
      const entry = state.diary.entries[entryId];
      const user = state.users[entry.user];

      days[dayIndex].entries.push({
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
    onClick: (year, month, day) => dispatch(diaryShowDate(year, month, day))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthContainer);