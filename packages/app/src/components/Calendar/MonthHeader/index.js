// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { previousMonth, nextMonth } from 'couples-diary-core';

import './styles.css';

type CalendarFunction = typeof previousMonth;

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
        <div className="secondary">{link(year, month, previousMonth)}</div>
        <div className="main">{monthName(month)}</div>
        <div className="secondary">{link(year, month, nextMonth)}</div>
      </div>
    );
  }
}

function link(
  currentYear: number,
  currentMonth: number,
  calendarFunction: CalendarFunction
) {
  const { year, month } = calendarFunction(currentYear, currentMonth);
  return <Link to={getCalendarPath(year, month)}>{monthName(month)}</Link>;
}

function monthName(month: number) {
  return NAME_OF_MONTHS[month - 1];
}

function getCalendarPath(year: number, month: number): string {
  return `/calendar/${year}/${month}`;
}
