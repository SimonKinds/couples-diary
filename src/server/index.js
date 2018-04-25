// @flow

import type { $Request } from 'express';

import express from 'express';
import bodyParser from 'body-parser';

import calendar from '../domain/calendar';
import api from './api';

const app = express();
app.use(bodyParser.json());

const users = [];

app.post('/api/user/create', (req: $Request, res) => {
  const result = api.createUser(req.body, users);
  res.status(result.status);

  if (result.body) {
    res.send(result.body);
  } else {
    res.send();
  }
});

app.post('/api/login', (req: $Request, res) => {
  // $FlowFixMe
  const { username, password } = req.body;
  if (username === 'Simon' && password === 'password') {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get('/api/calendar/:year/:month', (req: Request, res) => {
  // $FlowFixMe
  const { year, month } = req.params;
  const dates = calendar.calendarMonth(year, month);

  res.send(
    dates.map((date) => {
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
    }),
  );
});

app.listen(3000);
