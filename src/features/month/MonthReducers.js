import {MONTH_GET_SUCCESS} from './MonthActions'

const date = new Date()
const amountOfDays = 
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
const defaultState = {
  year: date.getFullYear(),
  month: date.getMonth(),
  days: extendDays([], daysInMonth())
}

function daysInMonth() {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export default function month(state = {month: defaultState}, action) {
  switch(action.type) {
    case MONTH_GET_SUCCESS:
      return {month: {
        year: action.year,
        month: action.month,
        days: extendDays(action.days, daysInMonth())}}
    default:
      return state
  }
}

function extendDays(days, amountOfDays) {
  let extendedDays = new Array(amountOfDays)
  for (const day of days) {
    extendedDays[day.day - 1] = day
  }
  for (let i = 0; i < amountOfDays; ++i) {
    if (!extendedDays[i]) {
      extendedDays[i] = {day: i + 1}
    }
  }
  return extendedDays
}
