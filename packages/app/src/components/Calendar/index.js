import React from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { calendarMonth, today } from 'couples-diary-core';

import Calendar from './component';

export const CALENDAR_GQL_QUERY = gql`
  query entries($year: Int!, $month: Int!) {
    myCouple {
      id
      me {
        id
        name
      }
      partner {
        id
        name
      }
    }
    me {
      id
      name
    }
    entries(year: $year, month: $month) {
      id
      year
      month
      date
      author {
        id
        name
        color
      }
    }
  }
`;

const getDateFromPath = match => ({
  year: parseFloat(match.params.year),
  month: parseFloat(match.params.month),
});

const hydrate = (year, month, entries) => {
  const dates = calendarMonth(year, month);

  return dates.map(date => {
    const authors = entries
      .filter(
        ({ year, month, date: entryDate }) =>
          year === date.year && month === date.month && entryDate === date.date
      )
      .map(({ author }) => author);

    return { ...date, authors };
  });
};

const renderCalendar = (year, month) => ({ data }) => (
  <Calendar
    partner={(data.myCouple && data.myCouple.partner.name) || ''}
    today={today()}
    selectedYear={year}
    selectedMonth={month}
    entries={hydrate(year, month, data.entries || [])}
  />
);

export const CalendarContainer = ({ match }) => {
  const { year, month } = getDateFromPath(match);
  return (
    <Query
      query={CALENDAR_GQL_QUERY}
      variables={{ year, month }}
      fetchPolicy="cache-and-network"
    >
      {renderCalendar(year, month)}
    </Query>
  );
};

CalendarContainer.propTypes = {
  match: PropTypes.object.isRequired,
};

export default CalendarContainer;
