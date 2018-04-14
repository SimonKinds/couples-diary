// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import EntryMarker from './EntryMarker';

import './styles.css';

type Props = {
  year: number,
  month: number,
  day: number,
  currentMonth: boolean,
  currentDay: boolean,
  entryHim?: boolean,
  entryHer?: boolean,
};
type State = {};

export default class CalendarDay extends PureComponent<Props, State> {
  render() {
    const {
      year, month, day, currentMonth, currentDay,
    } = this.props;
    return (
      <Link
        className={getClassNamesEntry(currentMonth)}
        to={`/entry/${year}/${month}/${day}`}
      >
        <div className={getClassNamesText(currentDay)}>{day}</div>
        <div className="entry-markers">
          {this.props.entryHer && <EntryMarker by="her" />}
          {this.props.entryHim && <EntryMarker by="him" />}
        </div>
      </Link>
    );
  }
}

function getClassNamesEntry(currentMonth: boolean) {
  return `day-entry${currentMonth ? '' : ' not-in-month'}`;
}

function getClassNamesText(currentDay: boolean) {
  return `day-text${currentDay ? ' today' : ''}`;
}
