import React, { PropTypes } from 'react';

function Day(props) {
  return (
    <div
      style={{
        flex: 1,
        border: '2px solid black',
        height: 80,
        padding: 5,
        margin: -1,
        cursor: 'pointer',
        background: props.isCurrentDay ? '#c7fce1' : 'white'
      }}
      onClick={props.onClick}
    >
      {props.day}
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {props.entries &&
          props.entries.map(entry => {
            return (
              <b key={entry.name + props.day} style={{ color: entry.color}}>{entry.name + ' '}</b>
            );
          })}
      </div>
    </div>
  );
}

Day.propTypes = {
  day: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ),
  isCurrentDay: PropTypes.bool.isRequired
};

export default Day;
