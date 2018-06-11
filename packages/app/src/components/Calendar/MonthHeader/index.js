import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { previousMonth, nextMonth } from 'couples-diary-core';
import Loader from '../../Loader';

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

export const MonthHeader = ({ year, month, loading }) => (
  <Fragment>
    {loading && <Loader className="absolute" />}
    <div className="year-header">
      <h3>{year}</h3>
    </div>
    <div className="month-header">
      {link(year, month, previousMonth)}
      <h2 className="main">{monthName(month)}</h2>
      {link(year, month, nextMonth)}
    </div>
  </Fragment>
);

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

export default MonthHeader;
