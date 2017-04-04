import React from 'react';

import MonthContainer from '../containers/MonthContainer';

function Diary(props) {
  return (
    <div>
      <b>{props.year}</b>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{ flex: 1 }}
          onClick={() => props.showPrevMonth(props.year, props.month)}
        >
          &lt; Previous month
        </div>
        <div style={{ flex: '1 100%' }}>
          <MonthContainer />
        </div>
        <div
          style={{ flex: 1 }}
          onClick={() => props.showNextMonth(props.year, props.month)}
        >
          Next month &gt;
        </div>
      </div>
    </div>
  );
}

export default Diary;
