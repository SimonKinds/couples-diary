// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {};
type State = {};

export default class Calendar extends PureComponent<Props, State> {
  render() {
    return (
      <div className="calendar">
        <div className="day">Mon</div>
        <div className="day">Tue</div>
        <div className="day">Wed</div>
        <div className="day">Thu</div>
        <div className="day">Fri</div>
        <div className="day">Sat</div>
        <div className="day">Sun</div>
      </div>);
  }
}
