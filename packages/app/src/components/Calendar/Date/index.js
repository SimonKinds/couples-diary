import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EntryMarker from './EntryMarker';

import './styles.css';

type State = {};

export default class CalendarDate extends PureComponent<Props, State> {
  render() {
    const { year, month, date, currentMonth, currentDate } = this.props;
    return (
      <Link
        className={getClassNamesEntry(currentMonth)}
        to={`/entry/${year}/${month}/${date}`}
      >
        <div className={getClassNamesText(currentDate)}>{date}</div>
        <div className="entry-markers">
          {this.props.entryHer && <EntryMarker by="her" />}
          {this.props.entryHim && <EntryMarker by="him" />}
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
  entryHim: PropTypes.bool,
  entryHer: PropTypes.bool,
};

function getClassNamesEntry(currentMonth) {
  return `date-entry${currentMonth ? '' : ' not-in-month'}`;
}

function getClassNamesText(currentDate) {
  return `date-text${currentDate ? ' today' : ''}`;
}
