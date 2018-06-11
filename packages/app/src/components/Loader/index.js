import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles.css';

export class Loader extends Component {
  static propTypes = {
    delay: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    delay: 100,
  };

  state = {
    waiting: true,
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        waiting: false,
      });
    }, this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    if (!this.state.waiting) {
      return <div className={`loader ${this.props.className || ''}`} />;
    }
    return null;
  }
}

export default Loader;
