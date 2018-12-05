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

function EntryContainer({ year, month, date, author: requestedAuthor }) {
  return (
    <Query
      query={ENTRY_GQL_QUERY}
      variables={{ year, month, date }}
      fetchPolicy="cache-and-network"
    >
      {renderEntry(year, month, date, requestedAuthor)}
    </Query>
  );
}

function renderEntry(year, month, date, requestedAuthor) {
  return ({ data: dataFromQuery, loading: loadingQuery }) => (
    <Entry
      body={
        loadingQuery
          ? renderEmptyEntryBody()
          : renderEntryBodyWithContent(
              dataFromQuery,
              loadingQuery,
              requestedAuthor,
              year,
              month,
              date
            )
      }
      year={year}
      month={month}
      date={date}
      nameOfPartner={getNameOfPartnerForAuthor(dataFromQuery, requestedAuthor)}
    />
  );
}

function renderEmptyEntryBody() {
  return <EntryBody nameOfUser={''} entry={''} loading={true} />;
}

function renderEntryBodyWithContent(
  dataFromQuery,
  loadingQuery,
  requestedAuthor,
  year,
  month,
  date
) {
  return isLoggedInUserAuthor(
    getLoggedInUserNameFromQuery(dataFromQuery),
    requestedAuthor
  )
    ? renderEditableEntryBody(dataFromQuery, requestedAuthor, year, month, date)
    : renderEntryBody(dataFromQuery, loadingQuery, requestedAuthor);
}

function renderEditableEntryBody(
  dataFromQuery,
  requestedAuthor,
  year,
  month,
  date
) {
  return (
    <EditableEntryBody
      year={year}
      month={month}
      date={date}
      nameOfUser={getLoggedInUserNameFromQuery(dataFromQuery)}
      entry={getEntryForAuthor(
        requestedAuthor,
        getEntriesFromQuery(dataFromQuery)
      )}
    />
  );
}

function renderEntryBody(dataFromQuery, loadingQuery, requestedAuthor) {
  return (
    <EntryBody
      nameOfUser={getPartnerNameFromQuery(dataFromQuery)}
      entry={getEntryForAuthor(
        requestedAuthor,
        getEntriesFromQuery(dataFromQuery)
      )}
      loading={loadingQuery}
    />
  );
}

function isLoggedInUserAuthor(loggedInUser, author) {
  return loggedInUser.toLowerCase() === author.toLowerCase();
}

function getLoggedInUserNameFromQuery(query) {
  return (query && query.me && query.me.name) || '';
}

function getEntriesFromQuery(query) {
  return (query && query.entries) || [];
}

function getNameOfPartnerForAuthor(query, requestedAuthor) {
  return isLoggedInUserAuthor(
    getLoggedInUserNameFromQuery(query),
    requestedAuthor
  )
    ? getPartnerNameFromQuery(query)
    : getLoggedInUserNameFromQuery(query);
}

function getPartnerNameFromQuery(query) {
  return (query && query.myCouple && query.myCouple.partner.name) || '';
}

function EditableEntryBody({ year, month, date, nameOfUser, entry }) {
  return (
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
}

function getEntryForAuthor(author, entries) {
  const entry = entries.filter(({ author: { name } }) => name === author)[0];

  if (entry !== undefined) {
    return entry.content;
  }

  return '';
}

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
export default EntryContainer;
