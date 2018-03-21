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
      <div className={getClassNames(currentMonth, currentDay)}>
        {day}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {this.props.entryHer && <EntryMarker by="her" />}
          {this.props.entryHim && <EntryMarker by="him" />}
        </div>
      </div>
    );
  }
}

function getClassNames(currentMonth: boolean, currentDay: boolean) {
  return `day-entry${currentDay ? ' current-day' : ''}${
    currentMonth ? '' : ' not-in-month'
  }`;
}
