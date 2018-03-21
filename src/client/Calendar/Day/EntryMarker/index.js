// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  by: 'him' | 'her'
};
type State = {};

export default class Component extends PureComponent<Props, State> {
  render() {
    return <div className={`entry-marker ${this.props.by}`} />;
  }
}
