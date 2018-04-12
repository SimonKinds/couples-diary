// @flow

import React, { PureComponent } from 'react';
import type { Node as ReactNode } from 'react';
import { pushPath } from '../../location';

type Props = {
  className?: string,
  href: string,
  text?: string,
  children?: ReactNode,
};
type State = {};

export default class Link extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).onClick = this.onClick.bind(this);
  }

  onClick(event: SyntheticEvent<*>) {
    event.preventDefault();
    pushPath(this.props.href);
  }

  render() {
    const {
      href, text, className, children,
    } = this.props;
    return (
      <a href={href} onClick={this.onClick} className={className}>
        {text || children}
      </a>
    );
  }
}
