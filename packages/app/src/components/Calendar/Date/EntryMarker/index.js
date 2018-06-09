import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export default class EntryMarker extends PureComponent {
  render() {
    return <div className={`entry-marker ${this.props.by}`} />;
  }
}

EntryMarker.propTypes = {
  by: PropTypes.oneOf(['him', 'her']),
};
