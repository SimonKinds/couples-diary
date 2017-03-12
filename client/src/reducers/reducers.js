import { combineReducers } from 'redux';

import { user, login } from './LoginReducers';
import month from './MonthReducers';
import diary from './DiaryReducers';

const reducers = combineReducers({ user, login, month, diary });

export default reducers;
