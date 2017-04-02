import React, {PropTypes} from 'react'

function Day(props) {
  return (
    <div style={
      {flex: 1, border: '2px solid black', padding: 5, margin: -1}}
      onClick={props.onClick}>
      {props.day}
      <span>
        {props.entries && props.entries.map((entry) => {
          return (
            <p key={entry.name + props.day} style={{color: entry.color}}> 
              <b >{entry.name + ' '}</b>
              <i style={{opacity: '0.7'}}>{entry.text}</i>
            </p>)
        })}
      </span>
    </div>
  )
}

Day.propTypes = {
  day: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }))
}

export default Day
