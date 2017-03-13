import { combineReducers } from 'redux';

import { user, login } from './LoginReducers';
import month from './MonthReducers';
import diary from './DiaryReducers';
import users from './UserReducer';
import couple from './CoupleReducer';

const reducers = combineReducers({ users, couple, user, login, month, diary });

export default reducers;
