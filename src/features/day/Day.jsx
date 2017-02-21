import React, {PropTypes} from 'react'

const Day = (props) => {
  return (
    <div style={
      {flex: 1, border: '2px solid black', borderRadius: '5px', padding: '5px'}}
      onClick={props.onClick}>
      <span>
        {props.day}
      </span>
      {props.entries.map((entry) => {
        return (
          <p key={entry.name} style={{color: entry.color}}> 
            <b >{entry.name + ' '}</b>
            <i style={{opacity: '0.7'}}>{entry.content}</i>
          </p>)
      })}
    </div>
  )
}

Day.propTypes = {
  day: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }))
}

export default Day
