// @flow

import React, { PureComponent } from 'react';
import { pushPath } from '../../location';

type Props = {
  href: string,
  text: string,
};
type State = {};

export default class Component extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).onClick = this.onClick.bind(this);
  }

  onClick(event: SyntheticEvent<*>) {
    event.preventDefault();
    pushPath(this.props.href);
  }

  render() {
    const { href, text } = this.props;
    return (
      <a href={href} onClick={this.onClick}>
        {text}
      </a>
    );
  }
}
