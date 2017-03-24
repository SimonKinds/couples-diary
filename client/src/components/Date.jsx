import React, { PropTypes } from 'react';

function DateComponent(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <DateEntry
        name={props.thisUser.name}
        color={props.thisUser.color}
        text={props.thisUser.text}
      />
      <DateEntry
        name={props.otherUser.name}
        color={props.otherUser.color}
        text={props.otherUser.text}
      />
    </div>
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

DateComponent.propTypes = {
  thisUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string,
    updatedText: PropTypes.string,
    isInEditMode: PropTypes.bool
  }),
  otherUser: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string
  })
};

export default DateComponent;
