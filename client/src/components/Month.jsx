import React, { PropTypes } from 'react';
import Day from './Day';

function Month(props) {
  return (
    <div>
      <b style={{fontSize: 30}}>{props.monthName}</b>
      <div style={{ display: 'flex'}}>
        {weekDays().map(name => (
          <div key={name} style={{ flex: 1, textAlign: 'center' }}>{name}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {renderRows(props)}
      </div>
    </div>
  );
}

function renderRows(props) {
  const { startIndex, days, onClick } = props;
  const daysInWeek = 7;

  const rows = [];
  let row = createEmptyDivs(startIndex);
  let columnIndex = startIndex;

  days.map(day => {
    if (columnIndex != 0 && columnIndex % daysInWeek == 0) {
      rows.push(renderRow(row));
      row = [];
    }

    row.push(createDay(day, onClick));
    ++columnIndex;
  });

  row = row.concat(
    createEmptyDivs(Math.abs(columnIndex - (rows.length + 1) * daysInWeek))
  );
  rows.push(renderRow(row));

  return rows;
}

let emptyDivKey = 0;
function createEmptyDivs(startIndex) {
  let row = [];
  let columnIndex = 0;
  while (columnIndex < startIndex) {
    row.push(
      <div
        key={'empty' + emptyDivKey++}
        style={{ flex: 1, padding: 5, margin: 1 }}
      />
    );
    ++columnIndex;
  }
  return row;
}

let rowIndex = 0;
function renderRow(row) {
  let reactRow = [];
  reactRow.push(
    <div key={'row' + rowIndex++} style={{ display: 'flex' }}>
      {row.map(day => day)}
    </div>
  );
  return reactRow;
}

function createDay(day, onClick) {
  return (
    <Day
      key={'day' + day.day}
      day={day.day}
      onClick={() => onClick(day.day)}
      entries={day.entries}
    />
  );
}

function weekDays(locale = 'en-us') {
  let days = new Array(7);
  let date = new Date();
  // 0 = Sunday
  const currentDay = date.getDay();
  date.setDate(date.getDate() + (1 - currentDay));

  for (let i = 0; i < 7; ++i) {
    days[i] = date.toLocaleString(locale, { weekday: 'long' });
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default Month;
