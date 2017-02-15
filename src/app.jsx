import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {createStore} from 'redux'

import loginReducers from './features/login/LoginReducers'
import LoginFormContainer from './features/login/LoginFormContainer'

let store = createStore(loginReducers)

let unsub = store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
  <Provider store={store}>
    <LoginFormContainer />
  </Provider>,
  document.getElementById('root')
)
