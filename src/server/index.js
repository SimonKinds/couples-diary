// @flow

import type { $Request, $Response } from 'express';

import express from 'express';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

import calendar from '../domain/calendar';
import api from './api';
import { hash, comparePasswordToHash } from './api/password';

const app = express();
app.use(bodyParser.json());
app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }),
);

const users = [];

app.post('/api/user/create', (req: $Request, res) => {
  send(api.createUser(req.body, users, hash), res);
});

app.post('/api/login', (req: $Request, res) => {
  send(
    api.loginUser(
      req.body,
      users,
      saveUserInSession(req),
      comparePasswordToHash,
    ),
    res,
  );
});

function saveUserInSession(req: $Request) {
  return (user: User) => {
    // $FlowFixMe: Not in flow-typed
    req.session.user = user;
  };
}

function send(
  result: | { status: number, body?: mixed }
    | Promise<{ status: number, body?: mixed }>,
  res: $Response,
) {
  if (result instanceof Promise) {
    result
      .then(plain => sendPlain(plain, res))
      .catch(() => sendPlain({ status: 500 }, res));
  } else {
    sendPlain(result, res);
  }
}

function sendPlain(result: { status: number, body?: mixed }, res: $Response) {
  res.status(result.status);
  if (result.body) {
    res.send(result.body);
  } else {
    res.send();
  }
}

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
