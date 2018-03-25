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
      <div className="month-header">{NAME_OF_MONTHS[this.props.month]}</div>
    );
  }
}
