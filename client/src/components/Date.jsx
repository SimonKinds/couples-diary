import React, { PropTypes } from 'react';

function DateComponent(props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        background: 'white',
        width: '70%',
        minWidth: 800,
        minHeight: '50%',
        maxHeight: '90%',
        overflowY: 'auto'
      }}
    >
      <div style={{ minWidth: '50%'}}>
        <UserDateEntry
          user={props.thisUser}
          onUserEntryChange={props.onUserEntryChange}
        />
        <div style={{margin: 10}}>
          <button
            style={{ cursor: 'pointer' }}
            onClick={() => props.onEditModeClicked()}
          >
            {editModeButtonName(props.thisUser.isInEditMode)}
          </button>
          {props.thisUser.isInEditMode &&
              <button
                style={{ cursor: 'pointer' }}
                onClick={() => props.onEntrySave(props.thisUser.text)}
              >
                Save
              </button>}
              {props.thisUser.isInEditMode &&
                  props.saveError &&
                  <p style={{ color: 'red' }}>Error saving entry</p>}
                </div>
              </div>
              <DateEntry
                name={props.otherUser.name}
                color={props.otherUser.color}
                text={props.otherUser.text}
              />
              {' '}
            </div>
  );
}

DateComponent.propTypes = {
  thisUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string,
    isInEditMode: PropTypes.bool
  }),
  otherUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string
  }),
  onUserEntryChange: PropTypes.func.isRequired,
  saveError: PropTypes.bool.isRequired
};

function editModeButtonName(isInEditMode) {
  if (isInEditMode) {
    return 'Cancel';
  }
  return 'Edit';
}

function UserDateEntry(props) {
  if (props.user.isInEditMode) {
    return (
      <EditableDateEntry
        name={props.user.name}
        color={props.user.color}
        text={props.user.text}
        onChange={props.onUserEntryChange}
      />
    );
  }
  return (
    <DateEntry
      name={props.user.name}
      color={props.user.color}
      text={props.user.text}
    />
  );
}

function DateEntry(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        minWidth: '50%',
        margin: 10
      }}
    >
      <b style={{ textAlign: 'center', color: props.color }}>{props.name}</b>
      <p style={{ whiteSpace: 'pre-wrap'}}>
        {props.text}
      </p>
    </div>
  );
}

function EditableDateEntry(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        height: '100%',
        margin: 10
      }}
    >
      <b style={{ textAlign: 'center', color: props.color }}>{props.name}</b>
      <textarea
        style={{ height: '100%', background: '#F3F3F3', marginTop: 10, resize: 'vertical' }}
        value={props.text}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}

export default DateComponent;
