// @flow

import React, { PureComponent } from 'react';
import DayName from './DayName';
import Day from './Day';
import MonthHeader from './MonthHeader';

import './styles.css';

type Props = {
  today: Date,
  selectedYear: number,
  selectedMonth: number,
};
type State = {};

const NAMES_OF_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default class Calendar extends PureComponent<Props, State> {
  render() {
    const { today, selectedYear, selectedMonth } = this.props;
    return (
      <section>
        <div className="calendar">
          <MonthHeader year={selectedYear} month={selectedMonth} />
          <div className="day-names">{getDayNames()}</div>
          <div className="grid">
            {getDays(selectedYear, selectedMonth, today)}
          </div>
        </div>
      </section>
    );
  }
}

function getDayNames() {
  return NAMES_OF_DAYS.map(name => <DayName key={name} name={name} />);
}

function getDays(year: number, month: number, today: Date) {
  const date = new Date(year, month);
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
        currentDay={i + 1 === today.getDate()}
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
  date.setDate(1);
  const daysFromPreviousMonth = toDateStartingMonday(date.getDay());

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
        currentDay={false}
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

  const daysFromNextMonth = 7 - toDateStartingMonday(date.getDay()) - 1;
  const nextMonth = date.getMonth() + 1;

  const days = [];
  for (let i = 0; i < daysFromNextMonth; i += 1) {
    const day = (
      <Day
        key={`M${nextMonth}-D${i}`}
        day={i + 1}
        currentMonth={false}
        currentDay={false}
      />
    );

    days.push(day);
  }

  return days;
}

function toDateStartingMonday(day: number) {
  const startingMonday = day - 1;
  if (startingMonday === -1) {
    return 6;
  }

  return startingMonday;
}
