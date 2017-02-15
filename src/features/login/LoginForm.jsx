import React, {PropTypes} from 'react'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    if (event) event.preventDefault()

    this.props.onSubmit(this.props.username)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label>Username</label>
          <input type="text"
            value={this.props.username}
            onChange={this.props.onUsernameChange}/>
        </form>
        <button onSubmit={this.onSubmit}>Login</button>
      </div>
    )
  }
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default LoginForm
