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

export const EntryHeader = ({ year, month, date }) => (
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        x="0px"
        y="0px"
        width="28px"
        height="28px"
        viewBox="0 0 24 24"
        enableBackground="new 0 0 24 24"
      >
        <g id="Bounding_Boxes">
          <g id="ui_x5F_spec_x5F_header_copy_3" />
          <path fill="none" d="M0,0h24v24H0V0z" />
        </g>
        <g id="Outline_1_">
          <g id="ui_x5F_spec_x5F_header_copy_4" />
          <path
            id="XMLID_37_"
            d="M14.06,9.02l0.92,0.92L5.92,19H5v-0.92L14.06,9.02 M17.66,3c-0.25,0-0.51,0.1-0.7,0.29l-1.83,1.83
		l3.75,3.75l1.83-1.83c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34C18.17,3.09,17.92,3,17.66,3L17.66,3z M14.06,6.19L3,17.25V21h3.75
		L17.81,9.94L14.06,6.19L14.06,6.19z"
          />
        </g>
      </svg>
      <span className="circle" />
    </div>
    <div className="entry-divider" />
  </Fragment>
);

EntryHeader.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
};

export default EntryHeader;
