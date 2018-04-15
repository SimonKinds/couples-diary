// @flow

import React, { PureComponent } from 'react';
import type { Match, RouterHistory } from 'react-router-dom';

import Calendar from './component';

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  match: Match,
  history: RouterHistory,
};
type State = {
  selectedMonth: number,
  selectedYear: number,
  today: Date,
};

export default class CalendarContainer extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const fromPath = getDateFromPath(nextProps.match);

    const { year, month } = fromPath;
    return Object.assign(prevState, {
      selectedMonth: month - 1,
      selectedYear: year,
    });
  }

  constructor(props: Props) {
    super(props);

    const today = new Date();
    this.state = {
      selectedMonth: today.getMonth(),
      selectedYear: today.getFullYear(),
      today,
    };
    (this: any).onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(event: SyntheticKeyboardEvent<Document>) {
    if (hadModifierKey(event)) {
      return;
    }

    const { history } = this.props;
    const { selectedYear, selectedMonth } = this.state;
    switch (event.key) {
      case 'ArrowLeft':
        history.push(getCalendarPath(selectedYear, selectedMonth - 1));
        break;
      case 'ArrowRight':
        history.push(getCalendarPath(selectedYear, selectedMonth + 1));
        break;
      default:
        break;
    }
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

function getDateFromPath(match: Match): null | { year: number, month: number } {
  if (match.params.year != null && match.params.month != null) {
    return {
      year: parseFloat(match.params.year),
      month: parseFloat(match.params.month),
    };
  }

  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function getCalendarPath(year: number, month: number): string {
  if (month === -1) {
    return `/calendar/${year - 1}/12`;
  } else if (month === 12) {
    return `/calendar/${year + 1}/01`;
  }

  return `/calendar/${year}/${month + 1}`;
}

function hadModifierKey(event: SyntheticKeyboardEvent<*>) {
  return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}
