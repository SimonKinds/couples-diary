import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {createStore} from 'redux'

import loginReducers from './features/login/LoginReducers'
import LoginFormContainer from './containers/LoginFormContainer'

let store = createStore(loginReducers)

ReactDOM.render(
  <Provider store={store}>
    <LoginFormContainer/>
  </Provider>,
  document.getElementById('root')
)
