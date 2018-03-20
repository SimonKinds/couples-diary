// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  day: number,
  currentMonth: boolean,
};
type State = {};

export default class CalendarDay extends PureComponent<Props, State> {
  render() {
    const { currentMonth, day } = this.props;
    return <div className={getClassNames(currentMonth)}>{day}</div>;
  }
}

function getClassNames(currentMonth: boolean) {
  return `day-entry${currentMonth ? '' : ' not-in-month'}`;
}
