import React from 'react';

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Entry from './component';

const EntryContainer = ({ year, month, date }) => (
  <Mutation
    mutation={gql`
      mutation SetEntry(
        $year: Int!
        $month: Int!
        $date: Int!
        $content: String!
      ) {
        setEntry(year: $year, month: $month, date: $date, content: $content) {
          content
        }
      }
    `}
  >
    {(setEntry, { data }) => (
      <Entry
        saveEntry={content =>
          setEntry({ variables: { year, month, date, content } })
        }
        nameOfUser="Margot"
        entry={(data && data.content) || ''}
        year={year}
        month={month}
        date={date}
      />
    )}
  </Mutation>
);

export default EntryContainer;
