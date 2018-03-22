// @flow

import React, { PureComponent } from 'react';
import EntryMarker from './EntryMarker';

import './styles.css';

type Props = {
  day: number,
  currentMonth: boolean,
  currentDay: boolean,
  entryHim?: boolean,
  entryHer?: boolean,
};
type State = {};

export default class CalendarDay extends PureComponent<Props, State> {
  render() {
    const { currentMonth, currentDay, day } = this.props;
    return (
      <div className={getClassNamesEntry(currentMonth)}>
        <div className={getClassNamesText(currentDay)}>{day}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {this.props.entryHer && <EntryMarker by="her" />}
          {this.props.entryHim && <EntryMarker by="him" />}
        </div>
      </div>
    );
  }
}

function getClassNamesEntry(currentMonth: boolean) {
  return `day-entry${currentMonth ? '' : ' not-in-month'}`;
}

function getClassNamesText(currentDay: boolean) {
  return `day-text${currentDay ? ' today' : ''}`;
}
