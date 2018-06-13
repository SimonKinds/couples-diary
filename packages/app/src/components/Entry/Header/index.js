import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import monthName from '../../../get-month-name';

import './styles.css';

const ending = number => {
  switch (number % 20) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const EntryHeader = ({ year, month, date, icon }) => (
  <Fragment>
    <div className="entry-header">
      <Link to={`/calendar/${year}/${month}`} className="calendar-navigation">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      </Link>
      <h2 className="date">
        {monthName(month)} {date}
        <sup>{ending(date)}</sup>
      </h2>
      {icon}
      <span className="circle" />
    </div>
    <div className="entry-divider" />
  </Fragment>
);

EntryHeader.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  icon: PropTypes.object.isRequired,
};

export default EntryHeader;
