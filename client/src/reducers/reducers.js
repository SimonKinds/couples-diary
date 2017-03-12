import { combineReducers } from 'redux';

import { user, login } from './LoginReducers';
import month from './MonthReducers';

const reducers = combineReducers({ user, login, month });

export default reducers;
