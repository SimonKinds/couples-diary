// @flow

import React, { PureComponent } from 'react';
import Link from '../../Link';

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
  year: number,
  month: number,
};
type State = {};

export default class MonthHeader extends PureComponent<Props, State> {
  render() {
    const { year, month } = this.props;
    return (
      <div className="month-header">
        <div className="secondary">
          <Link
            href={getCalendarPath(year, month - 1)}
            text={getMonthWrapping(month - 1)}
          />
        </div>
        <div className="main">{getMonthWrapping(this.props.month)}</div>
        <div className="secondary">
          <Link
            href={getCalendarPath(year, month + 1)}
            text={getMonthWrapping(month + 1)}
          />
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

function getCalendarPath(year: number, month: number): string {
  if (month === -1) {
    return `/calendar/${year - 1}/12`;
  } else if (month === 12) {
    return `/calendar/${year + 1}/01`;
  }

  return `/calendar/${year}/${month + 1}`;
}
