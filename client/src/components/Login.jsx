import React from 'react';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    if (event) event.preventDefault();

    this.props.onSubmit(this.props.username, this.props.password);
  }

  render() {
    return (
      <div style={{background: 'white', flexShrink: 1}}>
        <form onSubmit={this.onSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={this.props.username}
            onChange={event => this.props.onUsernameChange(event.target.value)}
          />
          <br />
          <label>Password</label>
          <input
            type="password"
            value={this.props.password}
            onChange={event => this.props.onPasswordChange(event.target.value)}
          />
          <br />
          <button onSubmit={this.onSubmit}>Login</button>
        </form>
        {this.props.loginError && <div>Error logging in</div>}
      </div>
    );
  }
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  loginError: PropTypes.bool.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default LoginForm;
