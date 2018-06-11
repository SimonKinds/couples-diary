import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EntryMarker from './EntryMarker';

import './styles.css';

export default class CalendarDate extends PureComponent {
  render() {
    const {
      year,
      month,
      date,
      authors,
      currentMonth,
      currentDate,
    } = this.props;
    return (
      <Link
        className={getClassNamesEntry(currentMonth)}
        to={`/entry/${year}/${month}/${date}`}
      >
        <div className={getClassNamesText(currentDate)}>{date}</div>
        <div className="entry-markers">
          {authors.map(({ color }) => (
            <EntryMarker key={color} color={color} />
          ))}
        </div>
      </Link>
    );
  }
}

CalendarDate.propTypes = {
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  currentMonth: PropTypes.bool.isRequired,
  currentDate: PropTypes.bool.isRequired,
  authors: PropTypes.array.isRequired,
};

function getClassNamesEntry(currentMonth) {
  return `date-entry${currentMonth ? '' : ' not-in-month'}`;
}

function getClassNamesText(currentDate) {
  return `date-text${currentDate ? ' today' : ''}`;
}
