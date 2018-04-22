// @flow

import React, { PureComponent } from 'react';
import type { Match, RouterHistory } from 'react-router-dom';

import { previousMonth, nextMonth, today } from '../../../domain/calendar';

import Calendar from './component';

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  match: Match,
  history: RouterHistory,
};
type State = {
  selectedMonth: number,
  selectedYear: number,
  today: SimpleDate,
};

export default class CalendarContainer extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const fromPath = getDateFromPath(nextProps.match);

    const { year, month } = fromPath;
    return Object.assign(prevState, {
      selectedMonth: month,
      selectedYear: year,
    });
  }

  constructor(props: Props) {
    super(props);

    const todayDate = today();
    this.state = {
      selectedMonth: todayDate.month,
      selectedYear: todayDate.year,
      today: todayDate,
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
        routeToPreviousMonth(history, selectedYear, selectedMonth);
        break;
      case 'ArrowRight':
        routeToNextMonth(history, selectedYear, selectedMonth);
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

function getDateFromPath(match: Match): { year: number, month: number } {
  return {
    year: parseFloat(match.params.year),
    month: parseFloat(match.params.month),
  };
}

function routeToPreviousMonth(
  history: RouterHistory,
  currentYear: number,
  currentMonth: number,
) {
  const { year, month } = previousMonth(currentYear, currentMonth);
  history.push(getCalendarPath(year, month));
}

function routeToNextMonth(
  history: RouterHistory,
  currentYear: number,
  currentMonth: number,
) {
  const { year, month } = nextMonth(currentYear, currentMonth);
  history.push(getCalendarPath(year, month));
}

function getCalendarPath(year: number, month: number): string {
  return `/calendar/${year}/${month}`;
}

function hadModifierKey(event: SyntheticKeyboardEvent<*>) {
  return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}
