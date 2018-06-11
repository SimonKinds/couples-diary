import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Loader from '../Loader';
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

  renderCalendar() {
    return (
      <Fragment>
        <div className="day-names">{getDayNames()}</div>
        <div className="grid">{this.getDates()}</div>
      </Fragment>
    );
  }

  render() {
    const { selectedYear, selectedMonth, loading } = this.props;
    return (
      <section>
        <div className="calendar">
          <MonthHeader year={selectedYear} month={selectedMonth} />
          {loading ? (
            <Loader active className="centered-loader" />
          ) : (
            this.renderCalendar()
          )}
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
