// @flow
import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react'

type Props = {
  onSubmit: (string) => void,
  error: bool,
};

type State = {
  email: string
};

class SignUp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { email: '' };
  }

  render() {
    return (
      <Form error={this.props.error}>
        <Form.Input
          name='email'
          label='Email'
          placeholder='john@smith.com'
          onChange={e => this.setState({ email: e.target.value })} />
        <Message
          error
          header='Error'
          content='Email already in use' />
        <Button
          name='submit'
          label='Submit'
          onClick={() => this.props.onSubmit(this.state.email)} />
      </Form>
    );
  };
}

export default SignUp;
