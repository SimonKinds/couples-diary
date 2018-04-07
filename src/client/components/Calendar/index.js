// @flow

import React, { PureComponent } from 'react';
import Calendar from './component';

type Props = {
  // it really is used, but doesn't get picked up in getDerivedStateFromProps
  // eslint-disable-next-line react/no-unused-prop-types
  path: string,
};
type State = {
  selectedMonth: number,
  selectedYear: number,
  today: Date,
};

export default class CalendarContainer extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const fromPath = getDateFromPath(nextProps.path);
    if (fromPath) {
      const { year, month } = fromPath;
      return Object.assign(prevState, {
        selectedMonth: month - 1,
        selectedYear: year,
      });
    }
    return null;
  }

  constructor(props: Props) {
    super(props);

    const today = new Date();
    this.state = {
      selectedMonth: today.getMonth(),
      selectedYear: today.getFullYear(),
      today,
    };
  }

  render() {
    return (
      <Calendar
        selectedYear={this.state.selectedYear}
        selectedMonth={this.state.selectedMonth}
        today={this.state.today}
      />
    );
  }
}

function getDateFromPath(path: string): null | { year: number, month: number } {
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
