const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000);
