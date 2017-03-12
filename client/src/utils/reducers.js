import { combineReducers } from 'redux';

import { user, login } from '../features/login/LoginReducers';
import month from '../features/month/MonthReducers';

const reducers = combineReducers({ user, login, month });

export default reducers;
