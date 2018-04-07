// @flow

import * as React from 'react';

type Props = {
  onSubmit: () => void,
  children?: React.Node,
};
type State = {};

export default class LoginForm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event: SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.props.onSubmit();
  }

  render() {
    return <form onSubmit={this.onSubmit}>{this.props.children}</form>;
  }
}
