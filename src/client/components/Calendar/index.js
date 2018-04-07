// @flow

import React, { PureComponent } from 'react';
import { getPath, pushPath } from '../../location';
import Calendar from './component';

type Props = {};
type State = {
  selectedMonth: number,
  selectedYear: number,
  today: Date,
};

export default class CalendarContainer extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const today = new Date();
    let selectedMonth = today.getMonth();
    let selectedYear = today.getFullYear();

    const fromPath = getDateFromPath(getPath());
    if (fromPath) {
      selectedMonth = fromPath.month - 1;
      selectedYear = fromPath.year;
    }

    this.state = {
      selectedMonth,
      selectedYear,
      today,
    };

    (this: any).selectDate = this.selectDate.bind(this);
  }

  selectDate(year: number, month: number) {
    this.setState({ selectedYear: year, selectedMonth: month });
    pushPath(`/calendar/${year}/${month + 1}`);
  }

  render() {
    return (
      <Calendar
        selectedYear={this.state.selectedYear}
        selectedMonth={this.state.selectedMonth}
        today={this.state.today}
        selectDate={this.selectDate}
      />
    );
  }
}

function getDateFromPath(
  path: string,
): null | { year: number, month: number } {
  const rgx = /^\/calendar\/(\d+)\/(\d+)$/;
  const matches = path.match(rgx);

  if (matches == null) {
    return null;
  }

  const [year, month] = matches.slice(1).map(parseFloat);
  if (Number.isNaN(year) || Number.isNaN(month)) {
    return null;
  }

  return { year, month };
}
