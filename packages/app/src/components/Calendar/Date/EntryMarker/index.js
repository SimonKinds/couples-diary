import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export const EntryMarker = ({ color }) => (
  <div style={{ backgroundColor: color }} className={`entry-marker`} />
);

EntryMarker.propTypes = {
  color: PropTypes.string.isRequired,
};

export default EntryMarker;
