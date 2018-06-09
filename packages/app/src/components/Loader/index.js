import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export default class Loader extends PureComponent {
  render() {
    return this.props.active ? (
      <div className={`loader ${this.props.className || ''}`} />
    ) : null;
  }
}

Loader.propTypes = {
  active: PropTypes.bool.isRequired,
  className: PropTypes.string,
};
