// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  name: string
};
type State = {};

export default class CalendarDayName extends PureComponent<Props, State> {
  render() {
    return <div className="day-name">{this.props.name}</div>;
  }
}
