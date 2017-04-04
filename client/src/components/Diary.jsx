import React from 'react';

import MonthContainer from '../containers/MonthContainer';

function Diary(props) {
  return (<div>
    <b>{props.year}</b>
    <MonthContainer />
  </div>)
}

export default Diary;
