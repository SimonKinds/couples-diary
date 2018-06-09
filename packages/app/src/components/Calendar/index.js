import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { previousMonth, nextMonth, today } from 'couples-diary-core';

import Calendar from './component';
import makeCancelable from '../../make-cancelable';

export default class CalendarContainer extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
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

  constructor(props) {
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
    this.onKeyDown = this.onKeyDown.bind(this);
    this.loadCalendar = this.loadCalendar.bind(this);
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

  onKeyDown(event) {
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

  fetchCalendar(year, month) {
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

CalendarContainer.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

function getDateFromPath(match) {
  return {
    year: parseFloat(match.params.year),
    month: parseFloat(match.params.month),
  };
}

function routeToPreviousMonth(history, currentYear, currentMonth) {
  const { year, month } = previousMonth(currentYear, currentMonth);
  history.push(getCalendarPath(year, month));
}

function routeToNextMonth(history, currentYear, currentMonth) {
  const { year, month } = nextMonth(currentYear, currentMonth);
  history.push(getCalendarPath(year, month));
}

function getCalendarPath(year, month): string {
  return `/calendar/${year}/${month}`;
}

function hadModifierKey(event) {
  return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}
