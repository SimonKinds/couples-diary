import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router, Route, IndexRedirect } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import { getJwtToken, buildUserFromToken } from './src/utils/jwt';
import { renewToken } from './src/actions/TokenActions';
import { getCouple } from './src/actions/CoupleActions';
import { onUrlChange } from './src/actions/UrlActions';

import reducers from './src/reducers/reducers';
import LoginContainer from './src/containers/LoginContainer';
import DiaryContainer from './src/containers/DiaryContainer';
import DateContainer from './src/containers/DateContainer';
import Countdown from './src/components/Countdown';

let store = createStore(
  reducers,
  applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory))
);

const history = syncHistoryWithStore(browserHistory, store);

// Dispatch actions on URL change. Also dispatch the first URL
store.dispatch(onUrlChange(history.getCurrentLocation().pathname));
history.listen(location => store.dispatch(onUrlChange(location.pathname)));

function App(props) {
  return (
    <div
      style={{
        background: '#ce9191',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <img
        style={{ marginTop: 10, alignSelf: 'center' }}
        src="http://couplesdiary.kindstrom.io/logo.png"
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
      <Countdown/>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        height: '100%',
        width: '100%'
      }}
    >
      {props.children}
    </div>
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} onEnter={requireAuth}>
        <IndexRedirect to="/diary" />
        <Route path="/diary" component={DiaryContainer} />
        <Route path="/diary/:year/:month" component={DiaryContainer} />
        <Route path="/diary/:year/:month/:day" component={DateContainer} />
      </Route>
      <Route path="/" component={App}>
        <Route path="/login" component={LoginContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

function requireAuth(nextState, replace) {
  const token = getJwtToken();
  if (token) {
    const user = buildUserFromToken(token);
    // get couple right away. If token is invalid we will fail in renew token
    store.dispatch(getCouple(user.coupleId, token));
    store.dispatch(renewToken(token));
  } else {
    replace({
      pathname: '/login',
      state: { nextPathName: nextState.location.pathname }
    });
  }
}
