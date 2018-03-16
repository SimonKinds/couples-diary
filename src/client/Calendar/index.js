// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {};
type State = {};

function getDaysFromPreviousMonth(date: Date) {
  const startDate = date.getDate();
  date.setDate(1);
  const daysFromPreviousMonth = ((date.getDay() + 7) - 1) % 7;
  date.setDate(startDate);

  const daysInPrevMonth =
    new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  const prevMonth = date.getMonth() - 1;

  const days = [];
  for (let i = daysInPrevMonth - daysFromPreviousMonth;
    i < daysInPrevMonth; i += 1) {
    days.push(<div key={`M${prevMonth}-D${i}`} className="day-entry not-in-month">{i + 1}</div>);
  }

  return days;
}

function getDaysFromNextMonth(date: Date) {
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);


  const daysFromNextMonth = 7 - ((date.getDay() + 7) % 7);
  const nextMonth = date.getMonth() + 1;


  const days = [];
  for (let i = 0; i < daysFromNextMonth; i += 1) {
    days.push(<div key={`M${nextMonth}-D${i}`} className="day-entry not-in-month">{i + 1}</div>);
  }

  return days;
}

function getDays() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);


  const daysInMonth = date.getDate();

  date.setDate(1);

  let days = [];
  days = days.concat(getDaysFromPreviousMonth(date));
  const daysFromPreviousMonth = days.length;

  for (let i = 0; i < daysInMonth; i += 1) {
    days.push((
      <div key={i + daysFromPreviousMonth} className="day-entry">
        {i + 1}
      </div>));
  }

  days = days.concat(getDaysFromNextMonth(date));

  return days;
}

export default class Calendar extends PureComponent<Props, State> {
  render() {
    return (
      <div className="calendar">
        <div className="day-name">Mon</div>
        <div className="day-name">Tue</div>
        <div className="day-name">Wed</div>
        <div className="day-name">Thu</div>
        <div className="day-name">Fri</div>
        <div className="day-name">Sat</div>
        <div className="day-name">Sun</div>
        {getDays()}
      </div>);
  }
}
