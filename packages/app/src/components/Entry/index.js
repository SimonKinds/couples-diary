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
      <Mutation
        mutation={gql`
          mutation SetEntry(
            $year: Int!
            $month: Int!
            $date: Int!
            $content: String!
          ) {
            setEntry(
              year: $year
              month: $month
              date: $date
              content: $content
            ) {
              content
            }
          }
        `}
      >
        {(setEntry, { data: dataFromMutation }) => (
          <Entry
            body={
              loadingQuery ? (
                <EntryBody nameOfUser={''} entry={''} />
              ) : (
                <EntryForm
                  saveEntry={content =>
                    setEntry({ variables: { year, month, date, content } })
                  }
                  nameOfUser={getNameOfUserFromQueryData(dataFromQuery)}
                  entry={
                    (dataFromMutation && dataFromMutation.setEntry.content) ||
                    getEntryForAuthor(
                      getNameOfUserFromQueryData(dataFromQuery),
                      (dataFromQuery && dataFromQuery.entries) || []
                    )
                  }
                />
              )
            }
            year={year}
            month={month}
            date={date}
          />
        )}
      </Mutation>
    )}
  </Query>
);

export default EntryContainer;
