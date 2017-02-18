import React, {PropTypes} from 'react'

const Date = (props) => {
  return (
    <div style={
      {flex: 1, border: '2px solid black', borderRadius: '5px'}}
      onClick={props.onClick}>
      {props.day}
    </div>
  )
}

Date.propTypes = {
  day: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Date
