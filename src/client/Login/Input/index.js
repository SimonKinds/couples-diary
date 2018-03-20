// @flow

import React, { PureComponent } from 'react';

import './styles.css';

type Props = {
  id: string,
  type: 'text' | 'password',
  value: string,
  label: string,
  onChange: (value: string) => void,
};
type State = {};

export default class LoginInput extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).onChange = this.onChange.bind(this);
  }

  onChange(event: SyntheticEvent<HTMLInputElement>) {
    this.props.onChange(event.currentTarget.value);
  }

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
