import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import login from './LoginReducers';
import diary from './DiaryReducers';
import users from './UserReducer';
import couple from './CoupleReducer';

const reducers = combineReducers({
  users,
  couple,
  login,
  diary,
  routing
});

export default reducers;
