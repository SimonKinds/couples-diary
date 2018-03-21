// @flow

import React, { PureComponent } from 'react';
import EntryMarker from './EntryMarker';

import './styles.css';

type Props = {
  day: number,
  currentMonth: boolean,
  entryHim?: boolean,
  entryHer?: boolean,
};
type State = {};

export default class CalendarDay extends PureComponent<Props, State> {
  render() {
    const { currentMonth, day } = this.props;
    return (
      <div className={getClassNames(currentMonth)}>
        {day}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {this.props.entryHer && <EntryMarker by="her" />}
          {this.props.entryHim && <EntryMarker by="him" />}
        </div>
      </div>);
  }
}

function getClassNames(currentMonth: boolean) {
  return `day-entry${currentMonth ? '' : ' not-in-month'}`;
}
