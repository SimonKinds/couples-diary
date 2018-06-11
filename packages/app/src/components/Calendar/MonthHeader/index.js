import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { previousMonth, nextMonth } from 'couples-diary-core';

import './styles.css';

const NAME_OF_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default class MonthHeader extends PureComponent {
  render() {
    const { year, month } = this.props;
    return (
      <Fragment>
        <h3 className="year-header">{year}</h3>
        <div className="month-header">
          {link(year, month, previousMonth)}
          <h2 className="main">{monthName(month)}</h2>
          {link(year, month, nextMonth)}
        </div>
      </Fragment>
    );
  }
}

MonthHeader.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
};

function link(currentYear, currentMonth, calendarFunction) {
  const { year, month } = calendarFunction(currentYear, currentMonth);
  return (
    <Link className="secondary" to={getCalendarPath(year, month)}>
      {monthName(month)}
    </Link>
  );
}

function monthName(month) {
  return NAME_OF_MONTHS[month - 1];
}

function getCalendarPath(year, month) {
  return `/calendar/${year}/${month}`;
}
