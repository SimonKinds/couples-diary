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
  year: number,
  month: number,
  selectDate: (year: number, month: number) => void,
};
type State = {};

export default class MonthHeader extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).selectPrevMonth = this.selectPrevMonth.bind(this);
    (this: any).selectNextMonth = this.selectNextMonth.bind(this);
  }

  selectPrevMonth(event: SyntheticEvent<*>) {
    if (!wasValidEvent(event)) {
      return;
    }

    const { year, selectDate, month: currentMonth } = this.props;
    const prevMonth = getMonthIndexWrapping(currentMonth - 1);
    if (prevMonth < currentMonth) {
      selectDate(year, prevMonth);
    } else {
      selectDate(year - 1, prevMonth);
    }
  }

  selectNextMonth(event: SyntheticEvent<*>) {
    if (!wasValidEvent(event)) {
      return;
    }

    const { year, selectDate, month: currentMonth } = this.props;
    const nextMonth = getMonthIndexWrapping(currentMonth + 1);
    if (nextMonth > currentMonth) {
      selectDate(year, nextMonth);
    } else {
      selectDate(year + 1, nextMonth);
    }
  }

  render() {
    return (
      <div className="month-header">
        <div
          role="button"
          tabIndex="0"
          className="secondary"
          onClick={this.selectPrevMonth}
          onKeyUp={this.selectPrevMonth}
        >
          {getMonthWrapping(this.props.month - 1)}
        </div>
        <div className="main">{getMonthWrapping(this.props.month)}</div>
        <div
          role="button"
          tabIndex="0"
          className="secondary"
          onClick={this.selectNextMonth}
          onKeyUp={this.selectNextMonth}
        >
          {getMonthWrapping(this.props.month + 1)}
        </div>
      </div>
    );
  }
}

function getMonthIndexWrapping(index: number) {
  if (index === -1) {
    return 11;
  } else if (index === 12) {
    return 0;
  }
  return index;
}

function getMonthWrapping(index: number) {
  if (index === -1) {
    return NAME_OF_MONTHS[11];
  } else if (index === 12) {
    return NAME_OF_MONTHS[0];
  }
  return NAME_OF_MONTHS[index];
}

function wasValidEvent(event: SyntheticEvent<*>) {
  return (
    event.type !== 'keyup' ||
    (event.type === 'keyup' && (event.key === 'Enter' ||
      event.key === ' ')));
}
