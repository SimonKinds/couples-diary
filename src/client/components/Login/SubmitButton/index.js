// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  id: string,
  value: string,
};
type State = {};

export default class LoginSubmitButton extends PureComponent<Props, State> {
  render() {
    return <input id={this.props.id} type="submit" value={this.props.value} />;
  }
}
