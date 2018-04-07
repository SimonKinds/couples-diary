// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {};
type State = {};

export default class FourOhFour extends PureComponent<Props, State> {
  render() {
    return <div className="fourohfour">404: No love found</div>;
  }
}
