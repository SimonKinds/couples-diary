import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRedirect } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import { getJwtToken, buildUserFromToken } from './src/utils/jwt';
import { getCouple } from './src/actions/CoupleActions';

import reducers from './src/reducers/reducers';
import LoginContainer from './src/containers/LoginContainer';
import MonthContainer from './src/containers/MonthContainer';

let store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory))
);

function App(props) {
  return <div>{props.children}</div>;
}

let isTrapped = false;
function requireAuth(nextState, replace) {
  const token = getJwtToken();
  const user = buildUserFromToken(token);
  // update some of the required information
  if (user) {
    store.dispatch(getCouple(user.coupleId, token));
  } else {
    isTrapped = true;
    replace({
      pathname: '/login',
      state: { nextPathName: nextState.location.pathname }
    });
  }
}

store.subscribe(() => console.log(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={requireAuth}>
        <IndexRedirect to="/diary" />
        <Route path="/diary" component={MonthContainer} />
        <Route path="/login" component={LoginContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
