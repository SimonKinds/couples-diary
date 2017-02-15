import React, {PropTypes} from 'react'

const LoginForm = ({username, onUsernameChange, onSubmit}) => {
  return (
  <div>
    <form onSubmit={onSubmit}>
      <label>Username</label>
      <input type="text" value={username} onChange={onUsernameChange}/>
    </form>
    <button onClick={onSubmit}>Login</button>
  </div>
  )
}

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default LoginForm
