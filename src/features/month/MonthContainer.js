import {connect} from 'react-redux'

import Month from './Month'
import {monthGet} from './MonthActions'

const mapStateToProps = state => {
  const date = new Date()
  date.setYear(state.month.year)
  date.setMonth(state.month.month)
  // 0 = last date of previous month
  date.setDate(1)
  return {
    startIndex: date.getDay() - 1,
    // long = full name
    monthName: date.toLocaleString('en-us', { month: "long"}),
    days: state.month.days
  }
}

const MonthContainer = connect(
  mapStateToProps
)(Month)

export default MonthContainer
