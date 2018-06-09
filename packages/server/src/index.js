import express from 'express';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

import { calendarMonth } from 'couples-diary-core';
import api from './api';

const app = express();
app.use(bodyParser.json());
app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api', api);

app.get('/api/calendar/:year/:month', (req, res) => {
  // $FlowFixMe
  const { year, month } = req.params;
  const dates = calendarMonth(year, month);

  res.send(
    dates.map(date => {
      switch (date.date % 4) {
        case 0:
          return Object.assign({}, date, { entryHim: true, entryHer: false });
        case 1:
          return Object.assign({}, date, { entryHim: true, entryHer: true });
        case 2:
          return Object.assign({}, date, { entryHim: false, entryHer: true });
        default:
          return date;
      }
    })
  );
});

app.listen(3333);
