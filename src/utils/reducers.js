import { combineReducers } from 'redux'

import {user, loginForm} from '../features/login/LoginReducers'
import month from '../features/month/MonthReducers'

const reducers = combineReducers({user, loginForm, month})

export default reducers
