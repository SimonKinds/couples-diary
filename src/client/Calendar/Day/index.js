// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  day: number,
  currentMonth: boolean,
};
type State = {};

export default class CalendarDay extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.setClassNames(this.props.currentMonth);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setClassNames(nextProps.currentMonth);
  }

  setClassNames(currentMonth: boolean) {
    this.classNames = `day-entry${currentMonth ? '' : ' not-in-month'}`;
  }

  classNames: string;

  render() {
    return <div className={this.classNames}>{this.props.day}</div>;
  }
}
