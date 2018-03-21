// @flow

import React, { PureComponent } from 'react';
import DayName from './DayName';
import Day from './Day';

import './styles.css';

type Props = {};
type State = {};

const NAMES_OF_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default class Calendar extends PureComponent<Props, State> {
  render() {
    return (
      <div className="calendar">
        {getDayNames()}
        {getDays()}
      </div>
    );
  }
}

function getDayNames() {
  return NAMES_OF_DAYS.map(name => <DayName key={name} name={name} />);
}

function getDays() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);

  const daysInMonth = date.getDate();

  date.setDate(1);

  let days = [];
  days = days.concat(
    getDaysFromPreviousMonth(date.getFullYear(), date.getMonth()),
  );

  for (let i = 0; i < daysInMonth; i += 1) {
    const day = (
      <Day
        key={`M${date.getMonth()}-D${i}`}
        day={i + 1}
        currentMonth
        entryHer
      />
    );
    days.push(day);
  }

  days = days.concat(getDaysFromNextMonth(date.getFullYear(), date.getMonth()));

  return days;
}

function getDaysFromPreviousMonth(year: number, month: number) {
  const date = new Date(year, month);
  const daysFromPreviousMonth = (7 - date.getDay()) % 7;

  const daysInPrevMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    0,
  ).getDate();

  const prevMonth = date.getMonth() - 1;

  const days = [];
  for (
    let i = daysInPrevMonth - daysFromPreviousMonth;
    i < daysInPrevMonth;
    i += 1
  ) {
    const day = (
      <Day
        key={`M${prevMonth}-D${i}`}
        day={i + 1}
        currentMonth={false}
        entryHim
        entryHer
      />
    );

    days.push(day);
  }

  return days;
}

function getDaysFromNextMonth(year: number, month: number) {
  const date = new Date(year, month + 1);
  date.setDate(0);

  const daysFromNextMonth = (7 - date.getDay()) % 7;
  const nextMonth = date.getMonth() + 1;

  const days = [];
  for (let i = 0; i < daysFromNextMonth; i += 1) {
    const day = (
      <Day key={`M${nextMonth}-D${i}`} day={i + 1} currentMonth={false} />
    );

    days.push(day);
  }

  return days;
}
