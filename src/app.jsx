import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {createStore} from 'redux'

import loginReducers from './features/login/LoginReducers'
import LoginForm from './features/login/LoginForm'

let store = createStore(loginReducers)

ReactDOM.render(
  <Provider store={store}>
    <LoginForm onUsernameChange={(event) => alert('Change')} username=''/>
  </Provider>,
  document.getElementById('root')
)
