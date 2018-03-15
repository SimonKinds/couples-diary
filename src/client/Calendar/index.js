// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {};
type State = {};

function getDays() {
  const days = [];
  for (let i = 0; i < 28; i += 1) {
    days.push(<div key={i} className="day-entry">{i + 1}</div>);
  }

  return days;
}

export default class Calendar extends PureComponent<Props, State> {
  render() {
    return (
      <div className="calendar">
        <div className="day-name">Mon</div>
        <div className="day-name">Tue</div>
        <div className="day-name">Wed</div>
        <div className="day-name">Thu</div>
        <div className="day-name">Fri</div>
        <div className="day-name">Sat</div>
        <div className="day-name">Sun</div>
        {getDays()}
      </div>);
  }
}
