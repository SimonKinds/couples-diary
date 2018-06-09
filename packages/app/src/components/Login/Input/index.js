import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export default class LoginInput extends PureComponent {
  onChange = event => {
    this.props.onChange(event.currentTarget.value);
  };

  render() {
    return (
      <label htmlFor={this.props.id}>
        {this.props.label}
        <input
          id={this.props.id}
          type={this.props.type}
          value={this.props.value}
          onChange={this.onChange}
        />
      </label>
    );
  }
}

LoginInput.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password']).isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
