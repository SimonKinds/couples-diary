import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { previousMonth, nextMonth } from 'couples-diary-core';

import Header from '../Header';
import { months } from '../../constants';

import './styles.css';

const Circle = ({ color, author }) => (
  <svg
    width="13"
    height="13"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="title"
  >
    <title>{author}</title>
    <circle cx="50%" cy="50%" r="50%" fill={color} />
  </svg>
);

Circle.propTypes = {
  color: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

const CalendarDate = ({ authors, date, isToday, isCurrentMonth }) => (
  <div
    className={`date ${isToday ? 'today' : ''} ${
      !isCurrentMonth ? 'not-in-month' : ''
    }`}
  >
    <p>{date}</p>
    <div className="entries">
      {authors.map(author => (
        <Circle key={author.name} author={author.name} color={author.color} />
      ))}
    </div>
  </div>
);

CalendarDate.propTypes = {
  date: PropTypes.number.isRequired,
  isToday: PropTypes.bool,
  isCurrentMonth: PropTypes.bool,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

CalendarDate.defaultProps = {
  isToday: false,
  isCurrentMonth: true,
};

const calendarLink = ({ year, month }) => `/calendar/${year}/${month}`;

const Calendar = ({ today, selectedYear, selectedMonth, entries, partner }) => (
  <Fragment>
    <Header />
    <main className="calendar-container">
      <h2>{selectedYear}</h2>
      <nav>
        <Link
          to={calendarLink(previousMonth(selectedYear, selectedMonth))}
          title="Previous month"
        >
          <svg
            aria-hidden
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            height="12"
            width="9"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
            />
          </svg>
        </Link>
        <h1>{months[selectedMonth - 1]}</h1>
        <Link
          to={calendarLink(nextMonth(selectedYear, selectedMonth))}
          title="Next month"
        >
          <svg
            aria-hidden
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            height="12"
            width="9"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
            />
          </svg>
        </Link>
      </nav>
      <section className="days">
        <p>mon</p>
        <p>tue</p>
        <p>wed</p>
        <p>thu</p>
        <p>fri</p>
        <p>sat</p>
        <p>sun</p>
      </section>
      <section className="calendar">
        {entries.map(entry => (
          <Link
            key={`m${entry.month}-d${entry.date}`}
            to={`/entry/${entry.year}/${entry.month}/${entry.date}/${partner}`}
          >
            <CalendarDate
              date={entry.date}
              isToday={
                today.year === selectedYear &&
                today.month === selectedMonth &&
                today.date === entry.date
              }
              isCurrentMonth={selectedMonth === entry.month}
              authors={entry.authors}
            />
          </Link>
        ))}
      </section>
    </main>
  </Fragment>
);

Calendar.propTypes = {
  partner: PropTypes.string.isRequired,
  today: PropTypes.shape({
    date: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  selectedYear: PropTypes.number.isRequired,
  selectedMonth: PropTypes.number.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      authors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          color: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Calendar;
