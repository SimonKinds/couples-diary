// @flow

import React, { PureComponent } from 'react';
import type { Match, RouterHistory } from 'react-router-dom';

import { previousMonth, nextMonth, today } from 'couples-diary-core';

import Calendar from './component';
import makeCancelable from '../../make-cancelable';

type Props = {
  match: Match,
  history: RouterHistory,
};
type State = {
  selectedMonth: number,
  selectedYear: number,
  today: SimpleDate,
  entries: Array<SummarizedEntry>,
  shouldLoad: boolean,
  loading: boolean,
};

export default class CalendarContainer extends PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const fromPath = getDateFromPath(nextProps.match);

    const { year, month } = fromPath;
    return {
      selectedMonth: month,
      selectedYear: year,
      shouldLoad:
        year !== prevState.selectedYear || month !== prevState.selectedMonth,
      loading: prevState.loading,
    };
  }

  loadingTimer: ?TimeoutID;
  calendarFetch: ?CancelablePromise<Response>;

  constructor(props: Props) {
    super(props);

    const todayDate = today();
    this.state = {
      selectedMonth: todayDate.month,
      selectedYear: todayDate.year,
      today: todayDate,
      entries: [],
      shouldLoad: true,
      loading: true,
    };

    this.loadingTimer = null;
    this.calendarFetch = null;
    (this: any).onKeyDown = this.onKeyDown.bind(this);
    (this: any).loadCalendar = this.loadCalendar.bind(this);
  }

  componentDidMount() {
    this.loadCalendar();
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate() {
    if (this.state.shouldLoad) {
      this.loadCalendar();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    this.cancelFetch();
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

  loadCalendar() {
    this.cancelFetch();
    this.fetchCalendar(this.state.selectedYear, this.state.selectedMonth);
  }

  fetchCalendar(year: number, month: number) {
    this.loadingTimer = setTimeout(() => this.setState({ loading: true }), 50);

    this.calendarFetch = makeCancelable(
      fetch(`/api/calendar/${year}/${month}`)
    );

    this.calendarFetch.promise
      .then(res => res.json())
      .then(entries => {
        this.cancelFetch();
        this.setState({ entries, shouldLoad: false, loading: false });
      })
      .catch(() => {});
  }

  cancelFetch() {
    if (this.loadingTimer != null) {
      clearTimeout(this.loadingTimer);
    }
    if (this.calendarFetch != null) {
      this.calendarFetch.cancel();
    }
  }

  render() {
    return <Calendar {...this.state} />;
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
  currentMonth: number
) {
  const { year, month } = previousMonth(currentYear, currentMonth);
  history.push(getCalendarPath(year, month));
}

function routeToNextMonth(
  history: RouterHistory,
  currentYear: number,
  currentMonth: number
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
