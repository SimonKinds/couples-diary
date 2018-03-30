// @flow

import React, { PureComponent } from 'react';
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
    this.state = {
      selectedMonth: today.getMonth(),
      selectedYear: today.getFullYear(),
      today,
    };

    (this: any).selectDate = this.selectDate.bind(this);
  }

  selectDate(year: number, month: number) {
    this.setState({ selectedYear: year, selectedMonth: month });
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
