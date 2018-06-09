function datesOfMonth(year, month) {
  const dates = [];

  const dateCount = numberOfDatesInMonth(year, month);
  for (let date = 1; date <= dateCount; date += 1) {
    dates.push({ year, month, date });
  }
  return dates;
}

function calendarMonth(year, month) {
  const currentMonth = datesOfMonth(year, month).map(d =>
    Object.assign({}, d, { inMonth: true })
  );

  const prevMonth = previousMonth(year, month);
  const daysSinceMonday = getDaysSinceMonday(toDate(currentMonth[0]));
  const datesOfPrevMonth = datesOfMonth(prevMonth.year, prevMonth.month)
    .map(d => Object.assign({}, d, { inMonth: false }))
    .splice(-1 * daysSinceMonday, daysSinceMonday);

  const nextMonthDate = nextMonth(year, month);
  const daysToSunday = getDaysToSunday(
    toDate(currentMonth[currentMonth.length - 1])
  );
  const datesOfNextMonth = datesOfMonth(nextMonthDate.year, nextMonthDate.month)
    .map(d => Object.assign({}, d, { inMonth: false }))
    .splice(0, daysToSunday);

  return datesOfPrevMonth.concat(currentMonth).concat(datesOfNextMonth);
}

function toDate(date) {
  return new Date(date.year, date.month - 1, date.date);
}

function getDaysSinceMonday(date) {
  return toDateStartingMonday(date.getDay());
}

function getDaysToSunday(date) {
  return 6 - toDateStartingMonday(date.getDay());
}

function numberOfDatesInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function toDateStartingMonday(day) {
  const startingMonday = day - 1;
  if (startingMonday === -1) {
    return 6;
  }

  return startingMonday;
}

function previousMonth(year, month) {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

function nextMonth(year, month) {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

function today() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
  };
}

module.exports = {
  datesOfMonth,
  calendarMonth,
  previousMonth,
  nextMonth,
  today,
};
