import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import loginReducers from './features/login/LoginReducers'
import LoginFormContainer from './features/login/LoginFormContainer'

let store = createStore(loginReducers, applyMiddleware(thunkMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <LoginFormContainer />
  </Provider>,
  document.getElementById('root')
)
