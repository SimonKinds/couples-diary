const express = require('express');
const vhost = require('vhost');
const path = require('path');

const app = express();
const api = require('./api/index');

app.get(
    '/', (req, res) => { res.sendFile(path.join(__dirname + '/index.html')); });
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/../build/bundle.js'));
});
app.use(vhost('api.localhost', api));

app.listen(8080, () => {console.log('Listening on port 8080')});
