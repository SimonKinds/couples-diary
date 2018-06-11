import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DayName from './DayName';
import CalendarDate from './Date';
import MonthHeader from './MonthHeader';

import './styles.css';

const NAMES_OF_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default class Calendar extends Component {
  getDates() {
    const { entries, today } = this.props;

    return entries.map(({ year, month, date, authors, inMonth }) => (
      <CalendarDate
        key={`${year}:${month}:${date}`}
        year={year}
        month={month}
        date={date}
        currentMonth={inMonth}
        currentDate={
          year === today.year && month === today.month && date === today.date
        }
        authors={authors}
      />
    ));
  }

  render() {
    const { selectedYear, selectedMonth, loading } = this.props;
    return (
      <section>
        <div className="calendar">
          <MonthHeader
            loading={loading}
            year={selectedYear}
            month={selectedMonth}
          />
          <div className="day-names">{getDayNames()}</div>
          <div className="grid">{this.getDates()}</div>
        </div>
      </section>
    );
  }
}

Calendar.propTypes = {
  today: PropTypes.object,
  selectedYear: PropTypes.number,
  selectedMonth: PropTypes.number,
  entries: PropTypes.array,
  loading: PropTypes.bool,
};

function getDayNames() {
  return NAMES_OF_DAYS.map(name => <DayName key={name} name={name} />);
}
