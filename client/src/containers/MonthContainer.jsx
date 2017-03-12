import { connect } from 'react-redux';
import React from 'react';

import Month from '../components/Month';
import { monthGet } from '../actions/MonthActions';

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
      />
    );
  }
}

function mapStateToProps(state) {
  const date = new Date();
  date.setYear(state.month.year);
  date.setMonth(state.month.month);
  // 0 = last date of previous month
  date.setDate(1);
  return {
    startIndex: date.getDay() - 1,
    // long = full name
    monthName: date.toLocaleString('en-us', { month: 'long' }),
    month: state.month.month,
    year: state.month.year,
    days: state.month.days,
    isFetching: state.month.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonth: (year, month) => dispatch(monthGet(year, month))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthContainer);
