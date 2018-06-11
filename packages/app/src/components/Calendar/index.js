import React from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { calendarMonth, today } from 'couples-diary-core';

import Calendar from './component';

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

export const CalendarContainer = ({ match }) => {
  const { year, month } = getDateFromPath(match);
  return (
    <Query
      asyncMode
      query={gql`
        query entries($year: Int!, $month: Int!) {
          entries(year: $year, month: $month) {
            year
            month
            date
            author {
              color
            }
          }
        }
      `}
      variables={{ year, month }}
    >
      {({ loading, error, data }) => {
        return (
          <Calendar
            today={today()}
            selectedYear={year}
            selectedMonth={month}
            entries={hydrate(year, month, data.entries || [])}
            loading={loading}
          />
        );
      }}
    </Query>
  );
};

CalendarContainer.propTypes = {
  match: PropTypes.object.isRequired,
};

export default CalendarContainer;
