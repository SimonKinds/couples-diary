// @flow

import React, { PureComponent, Fragment } from 'react';

import Loader from '../Loader';
import DayName from './DayName';
import CalendarDate from './Date';
import MonthHeader from './MonthHeader';

import './styles.css';

type Props = {
  today: SimpleDate,
  selectedYear: number,
  selectedMonth: number,
  entries: Array<SummarizedEntry>,
  loading: boolean,
};
type State = {};

const NAMES_OF_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default class Calendar extends PureComponent<Props, State> {
  getDates() {
    const { entries, today } = this.props;

    return entries.map(({
      year, month, date, entryHim, entryHer, inMonth,
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
        entryHim={entryHim}
        entryHer={entryHer}
      />
    ));
  }

  renderCalendar() {
    return (
      <Fragment>
        <div className="day-names">{getDayNames()}</div>
        <div className="grid">{this.getDates()}</div>
      </Fragment>
    );
  }

  render() {
    const { selectedYear, selectedMonth, loading } = this.props;
    return (
      <section>
        <div className="calendar">
          <MonthHeader year={selectedYear} month={selectedMonth} />
          {loading ? (
            <Loader active className="centered-loader" />
          ) : (
            this.renderCalendar()
          )}
        </div>
      </section>
    );
  }
}

function getDayNames() {
  return NAMES_OF_DAYS.map(name => <DayName key={name} name={name} />);
}
