import { combineReducers } from 'redux';

import login from './LoginReducers';
import month from './MonthReducers';
import diary from './DiaryReducers';
import users from './UserReducer';
import couple from './CoupleReducer';

const reducers = combineReducers({ users, couple, login, month, diary });

export default reducers;
