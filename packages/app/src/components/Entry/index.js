import React from 'react';

import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import Entry, { EntryForm, EntryBody } from './component';

const getEntryForAuthor = (author, entries) => {
  const entry = entries.filter(({ author: { name } }) => name === author)[0];

  if (entry !== undefined) {
    return entry.content;
  }

  return '';
};

const getNameOfUserFromQueryData = data =>
  (data && data.me && data.me.name) || '';

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

const EntryContainer = ({ year, month, date }) => (
  <Query
    query={gql`
      query Entries($year: Int!, $month: Int!, $date: Int!) {
        me {
          name
        }
        entries(year: $year, month: $month, date: $date) {
          content
          author {
            name
          }
        }
      }
    `}
    variables={{ year, month, date }}
  >
    {({ data: dataFromQuery, loading: loadingQuery, error: errorInQuery }) => (
      <Entry
        body={
          loadingQuery ? (
            <EntryBody nameOfUser={''} entry={''} />
          ) : (
            <EditableEntryBody
              year={year}
              month={month}
              date={date}
              nameOfUser={getNameOfUserFromQueryData(dataFromQuery)}
              entry={getEntryForAuthor(
                getNameOfUserFromQueryData(dataFromQuery),
                (dataFromQuery && dataFromQuery.entries) || []
              )}
            />
          )
        }
        year={year}
        month={month}
        date={date}
      />
    )}
  </Query>
);

export default EntryContainer;
