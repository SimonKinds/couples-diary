// @flow

import React, { PureComponent } from 'react';

import './styles.css';

const NAME_OF_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Props = {
  month: number,
};
type State = {};

export default class MonthHeader extends PureComponent<Props, State> {
  render() {
    return (
      <div className="month-header">
        <div className="secondary">
          {getMonthWrapping(this.props.month - 1)}
        </div>
        <div className="main">{getMonthWrapping(this.props.month)}</div>
        <div className="secondary">
          {getMonthWrapping(this.props.month + 1)}
        </div>
      </div>
    );
  }
}

function getMonthWrapping(index: number) {
  if (index === -1) {
    return NAME_OF_MONTHS[11];
  } else if (index === 12) {
    return NAME_OF_MONTHS[0];
  }
  return NAME_OF_MONTHS[index];
}
