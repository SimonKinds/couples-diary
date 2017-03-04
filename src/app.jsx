import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory, Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import {buildUserFromToken} from './utils/jwt'

import reducers from './utils/reducers'
import LoginFormContainer from './features/login/LoginFormContainer'
import MonthContainer from './features/month/MonthContainer'

let store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)))

const App = (props) =>
{
  return (<div>{props.children}</div>)
}

let isTrapped = false
const requireAuth = (nextState, replace) => {
  if (!buildUserFromToken() && !isTrapped) {
    isTrapped = true
    replace({
      pathname: '/login',
      state: {nextPathName: nextState.location.pathname}
    })
  } 
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App} onEnter={requireAuth}>
        <IndexRedirect to='/diary'/>
        <Route path='/diary' component={MonthContainer}/>
        <Route path='/login' component={LoginFormContainer}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
