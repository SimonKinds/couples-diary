import React from 'react';

import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import Entry, { EntryForm, EntryBody } from './component';
import { CALENDAR_GQL_QUERY } from '../Calendar';
import {
  getNameOfPartnerFromQueryData,
  getNameOfUserFromQueryData,
} from '../../couple';

const ENTRY_GQL_QUERY = gql`
  query Entries($year: Int!, $month: Int!, $date: Int!) {
    myCouple {
      id
      creator {
        id
        name
      }
      other {
        id
        name
      }
    }
    me {
      id
      name
    }
    entries(year: $year, month: $month, date: $date) {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

const getEntryForAuthor = (author, entries) => {
  const entry = entries.filter(({ author: { name } }) => name === author)[0];

  if (entry !== undefined) {
    return entry.content;
  }

  return '';
};

const EditableEntryBody = ({ year, month, date, nameOfUser, entry }) => (
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
    refetchQueries={[
      { query: CALENDAR_GQL_QUERY, variables: { year, month } },
      { query: ENTRY_GQL_QUERY, variables: { year, month, date } },
    ]}
  >
    {(setEntry, { data: dataFromMutation }) => (
      <EntryForm
        saveEntry={content =>
          setEntry({ variables: { year, month, date, content } })
        }
        nameOfUser={nameOfUser}
        entry={(dataFromMutation && dataFromMutation.setEntry.content) || entry}
      />
    )}
  </Mutation>
);

const EntryContainer = ({ year, month, date, author: requestedAuthor }) => (
  <Query
    query={ENTRY_GQL_QUERY}
    variables={{ year, month, date }}
    pollInterval={10000}
  >
    {({ data: dataFromQuery, loading: loadingQuery, error: errorInQuery }) => (
      <Entry
        body={
          loadingQuery ? (
            <EntryBody nameOfUser={''} entry={''} />
          ) : dataFromQuery.me.name.toLowerCase() ===
          requestedAuthor.toLowerCase() ? (
            <EditableEntryBody
              year={year}
              month={month}
              date={date}
              nameOfUser={getNameOfUserFromQueryData(dataFromQuery)}
              entry={getEntryForAuthor(
                requestedAuthor,
                (dataFromQuery && dataFromQuery.entries) || []
              )}
            />
          ) : (
            <EntryBody
              nameOfUser={getNameOfPartnerFromQueryData(dataFromQuery)}
              entry={getEntryForAuthor(
                requestedAuthor,
                (dataFromQuery && dataFromQuery.entries) || []
              )}
            />
          )
        }
        year={year}
        month={month}
        date={date}
        nameOfPartner={
          ((dataFromQuery &&
            dataFromQuery.me &&
            dataFromQuery.me.name.toLowerCase()) ||
            '') === requestedAuthor.toLowerCase()
            ? getNameOfPartnerFromQueryData(dataFromQuery)
            : getNameOfUserFromQueryData(dataFromQuery)
        }
      />
    )}
  </Query>
);

export default EntryContainer;
