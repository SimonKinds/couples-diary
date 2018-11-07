import React from 'react';

import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';

import Entry, { EntryForm, EntryBody } from './component';
import { CALENDAR_GQL_QUERY } from '../Calendar';

const ENTRY_GQL_QUERY = gql`
  query Entries($year: Int!, $month: Int!, $date: Int!) {
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
    {(
      setEntry,
      {
        data: dataFromMutation,
        called: didCallMutation,
        error: errorFromMutation,
        loading,
      }
    ) => {
      if (didCallMutation && errorFromMutation == null) {
        removeLocallySavedEntry(
          locallySavedEntryKey(nameOfUser, year, month, date)
        );
      }

      return (
        <EntryForm
          saveEntry={content =>
            setEntry({ variables: { year, month, date, content } })
          }
          nameOfUser={nameOfUser}
          entry={
            (dataFromMutation &&
              dataFromMutation.setEntry &&
              dataFromMutation.setEntry.content) ||
            entry
          }
          getLocallySavedEntry={() =>
            getLocallySavedEntry(
              locallySavedEntryKey(nameOfUser, year, month, date)
            )
          }
          locallySaveEntry={entry =>
            setLocallySavedEntry(
              locallySavedEntryKey(nameOfUser, year, month, date),
              entry
            )
          }
          errorOnSave={didCallMutation && errorFromMutation != null}
          loading={loading}
        />
      );
    }}
  </Mutation>
);

function getLocallySavedEntry(key) {
  return localStorage.getItem(key);
}

function setLocallySavedEntry(key, entry) {
  return localStorage.setItem(key, entry);
}

function removeLocallySavedEntry(key) {
  return localStorage.removeItem(key);
}

function locallySavedEntryKey(user, year, month, date) {
  return `${user}${year}${month}${date}`;
}

const EntryContainer = ({ year, month, date, author: requestedAuthor }) => (
  <Query
    query={ENTRY_GQL_QUERY}
    variables={{ year, month, date }}
    fetchPolicy="cache-and-network"
  >
    {({ data: dataFromQuery, loading: loadingQuery }) => (
      <Entry
        body={
          loadingQuery ? (
            <EntryBody nameOfUser={''} entry={''} loading={loadingQuery} />
          ) : dataFromQuery.me.name.toLowerCase() ===
          requestedAuthor.toLowerCase() ? (
            <EditableEntryBody
              year={year}
              month={month}
              date={date}
              nameOfUser={
                (dataFromQuery && dataFromQuery.me && dataFromQuery.me.name) ||
                ''
              }
              entry={getEntryForAuthor(
                requestedAuthor,
                (dataFromQuery && dataFromQuery.entries) || []
              )}
            />
          ) : (
            <EntryBody
              nameOfUser={
                (dataFromQuery &&
                  dataFromQuery.myCouple &&
                  dataFromQuery.myCouple.partner.name) ||
                ''
              }
              entry={getEntryForAuthor(
                requestedAuthor,
                (dataFromQuery && dataFromQuery.entries) || []
              )}
              loading={loadingQuery}
            />
          )
        }
        year={year}
        month={month}
        date={date}
        nameOfPartner={
          (dataFromQuery && dataFromQuery.myCouple) !== undefined
            ? dataFromQuery.myCouple.me.name.toLowerCase() ===
              requestedAuthor.toLowerCase()
              ? dataFromQuery.myCouple.partner.name
              : dataFromQuery.myCouple.me.name
            : ''
        }
      />
    )}
  </Query>
);

export default EntryContainer;
