// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  active: boolean,
  className?: string,
};
type State = {};

export default class Loader extends PureComponent<Props, State> {
  render() {
    return this.props.active ? (
      <div className={`loader ${this.props.className || ''}`} />
    ) : null;
  }
}
