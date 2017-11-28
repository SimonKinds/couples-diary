// @flow
import React from 'react';

type Props = {
  onSubmit: (string) => void,
};

type State = {
  email: string
};

class SignUp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {email: ''};
  }

  render() {
    return (
      <form className='signup'>
      Email:
      <input name='email' type='text'
      onChange={e => this.setState({email: e.target.value})}/>
      <button name='submit' type='submit' value='Submit'
      onClick={() => this.props.onSubmit(this.state.email)}/>
      </form>
    );
  };
}

export default SignUp;
