import React, {PropTypes} from 'react'

const LoginForm = ({onUsernameChange, username}) => {
  return (
  <div>
    <form>
      <label>Username</label>
      <input type="text" value={username} onChange={onUsernameChange}/>
    </form>
  </div>
  )
}

LoginForm.propTypes = {
  onUsernameChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default LoginForm
