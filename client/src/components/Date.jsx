import React, { PropTypes } from 'react';

function DateComponent(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <EditableDateEntry
        name={props.thisUser.name}
        color={props.thisUser.color}
        text={props.thisUser.text}
        onChange={props.onUserEntryChange}
      />
      <DateEntry
        name={props.otherUser.name}
        color={props.otherUser.color}
        text={props.otherUser.text}
      />
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
