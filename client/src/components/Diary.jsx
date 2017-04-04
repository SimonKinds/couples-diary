import React from 'react';

import MonthContainer from '../containers/MonthContainer';

function Diary(props) {
  return (<div>
    <b>{props.year}</b>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div onClick={() => props.showPrevMonth(props.year, props.month)}>
        &lt;
      </div>
      <MonthContainer />
      <div onClick={() => props.showNextMonth(props.year, props.month)}>
        &gt;
      </div>
    </div>
  </div>)
}

export default Diary;
