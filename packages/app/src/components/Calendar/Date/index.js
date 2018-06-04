// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import EntryMarker from './EntryMarker';

import './styles.css';

type Props = {
  year: number,
  month: number,
  date: number,
  currentMonth: boolean,
  currentDate: boolean,
  entryHim?: boolean,
  entryHer?: boolean,
};
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

function getClassNamesEntry(currentMonth: boolean) {
  return `date-entry${currentMonth ? '' : ' not-in-month'}`;
}

function getClassNamesText(currentDate: boolean) {
  return `date-text${currentDate ? ' today' : ''}`;
}
