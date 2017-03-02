import React, {PropTypes} from 'react'
import Day from '../day/Day'

const Month = (props) => {
  return (
    <div>
      {props.monthName}
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {renderRows(props.startIndex, props.days)}
      </div>
    </div>
  )
}

const renderRows = (startIndex, days) => {
  const daysInWeek = 7

  const rows = []
  let row = createEmptyDivs(startIndex)
  let columnIndex = startIndex

  days.map((day) => {
    if (columnIndex != 0 && columnIndex % daysInWeek == 0) {
      rows.push(renderRow(row))
      row = []
    }

    row.push(createDay(day))
    ++columnIndex
  })

  row = row.concat(createEmptyDivs(Math.abs(columnIndex - ((rows.length + 1) * daysInWeek))))
  rows.push(renderRow(row))

  return rows
}

let emptyDivKey = 0
const createEmptyDivs = (startIndex) => {
  let row = []
  let columnIndex = 0
  while (columnIndex < startIndex) {
    row.push(<div key={'empty' + emptyDivKey++} style={{flex: 1, padding: 5, margin: 1}}/>)
    ++columnIndex
  }
  return row
}

let rowIndex = 0
const renderRow = (row) => {
  let reactRow = []
  reactRow.push(
    <div key={'row' + rowIndex++} style={{display: 'flex'}}>
      {row.map((day) => day)}
    </div>)
  return reactRow
}

const createDay = (day) => {
  return <Day
    key={'day' + day.day}
    day={day.day} 
    onClick={() => alert(day.day)}
    entries={day.entries}/>
}

export default Month
