import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export default class LoginSubmitButton extends PureComponent {
  render() {
    return <input id={this.props.id} type="submit" value={this.props.value} />;
  }
}

LoginSubmitButton = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
