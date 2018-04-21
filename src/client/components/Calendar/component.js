// @flow

import React, { PureComponent } from 'react';

import DayName from './DayName';
import CalendarDate from './Date';
import MonthHeader from './MonthHeader';

import { calendarMonth } from '../../../domain/calendar';

import './styles.css';

type Props = {
  today: SimpleDate,
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
            {getDates(selectedYear, selectedMonth, today)}
          </div>
        </div>
      </section>
    );
  }
}

function getDayNames() {
  return NAMES_OF_DAYS.map(name => <DayName key={name} name={name} />);
}

function getDates(
  currentYear: number,
  currentMonth: number,
  today: SimpleDate,
) {
  return calendarMonth(currentYear, currentMonth).map(
    ({
      year, month, date, inMonth,
    }) => (
      <CalendarDate
        key={`${year}:${month}:${date}`}
        year={year}
        month={month}
        date={date}
        currentMonth={inMonth}
        currentDate={
          year === today.year && month === today.month && date === today.date
        }
        entryHim
      />
    ),
  );
}
