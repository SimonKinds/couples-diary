const express = require('express');
const bodyParser = require('body-parser');

const calendar = require('../domain/calendar');

const app = express();
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Simon' && password === 'password') {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get('/api/calendar/:year/:month', (req, res) => {
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
