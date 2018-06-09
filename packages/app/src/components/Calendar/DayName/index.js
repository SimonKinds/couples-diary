import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export default class CalendarDayName extends PureComponent {
  render() {
    return <div className="day-name">{this.props.name}</div>;
  }
}

CalendarDayName.propTypes = {
  name: PropTypes.string.isRequired,
};
