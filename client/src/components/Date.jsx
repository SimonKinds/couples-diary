import React, { PropTypes } from 'react';

function DateComponent(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <UserDateEntry
          user={props.thisUser}
          onUserEntryChange={props.onUserEntryChange}
        />
        <div>
        <button onClick={() => props.onEditModeClicked()}>Edit</button>
        {props.thisUser.isInEditMode &&
          <button onClick={() => props.onEntrySave(props.thisUser.text)}>
            Save
          </button>}
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
  onUserEntryChange: PropTypes.func.isRequired
};

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
        justifyContent: 'center'
      }}
    >
      <b style={{ textAlign: 'center' }}>{props.name}</b>
      <p>{props.text}</p>
    </div>
  );
}

function EditableDateEntry(props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <b style={{ textAlign: 'center' }}>{props.name}</b>
      <textarea
        value={props.text}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
}

export default DateComponent;
