import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  diaryGetMonth,
  entryOnChange,
  entryOnEditModeClicked,
  entryOnSave
} from '../actions/DiaryActions';

import DateComponent from '../components/Date';

class DateContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.shouldFetch) {
      this.props.getDate(this.props.year, this.props.month, this.props.day);
    }
  }

  render() {
    if (this.props.isFetching) {
      return <div>loading...</div>;
    }
    return (
      <DateComponent
        thisUser={this.props.thisUser}
        otherUser={this.props.otherUser}
        saveError={this.props.saveError}
        onUserEntryChange={this.props.onUserEntryChange}
        onEditModeClicked={this.props.onEditModeClicked}
        onEntrySave={text =>
          this.props.onEntrySave(
            this.props.year,
            this.props.month,
            this.props.day,
            text
          )}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { diary, couple, users } = state;
  const { year, month, day } = diary.date;
  const thisUser = users[couple.thisUser];
  const otherUser = users[couple.otherUser];

  if (_.some(diary.fetched, { year, month })) {
    let entries = _.filter(diary.dates, date =>
      _.isMatch(date, { year, month, day })).map(date =>
        _.map(date.entries, entryId => diary.entries[entryId]));
    entries = _.flatten(entries);

    const thisUserEntry = _.find(
      entries,
      {user: thisUser.id}
    );
    const otherUserEntry = _.find(
      entries,
      {user: otherUser.id}
    ) || { text: 'No entry for this day :(' };

    const thisUserText = diary.date.ui.isInEditMode
      ? diary.date.ui.updatedText
      : thisUserEntry.text;

    return {
      year,
      month,
      day,
      shouldFetch: false,
      isFetching: false,
      saveError: diary.date.saveError,
      thisUser: {
        name: thisUser.username,
        color: thisUser.color,
        text: thisUserText,
        isInEditMode: diary.date.ui.isInEditMode
      },
      otherUser: {
        name: otherUser.username,
        color: otherUser.color,
        text: otherUserEntry.text
      }
    };
  }

  return {
    year,
    month,
    day,
    shouldFetch: true,
    isFetching: true
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDate: (year, month, day) => dispatch(diaryGetMonth(year, month)),
    onUserEntryChange: text => dispatch(entryOnChange(text)),
    onEditModeClicked: () => dispatch(entryOnEditModeClicked()),
    onEntrySave: (year, month, day, text) =>
      dispatch(entryOnSave(year, month, day, text))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DateContainer);
