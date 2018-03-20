// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  active: boolean,
};
type State = {};

export default class Component extends PureComponent<Props, State> {
  render() {
    return this.props.active ? <div className="loader" /> : null;
  }
}
