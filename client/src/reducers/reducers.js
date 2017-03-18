import { combineReducers } from 'redux';

import login from './LoginReducers';
import diary from './DiaryReducers';
import users from './UserReducer';
import couple from './CoupleReducer';

const reducers = combineReducers({ users, couple, login, diary });

export default reducers;
