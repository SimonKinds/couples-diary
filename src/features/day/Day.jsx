import React, {PropTypes} from 'react'

const Day = (props) => {
  return (
    <div style={
      {flex: 1, border: '2px solid black', borderRadius: '5px'}}
      onClick={props.onClick}>
      {props.day}
    </div>
  )
}

Day.propTypes = {
  day: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Day
