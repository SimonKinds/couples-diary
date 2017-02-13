const express = require('express');
const vhost = require('vhost');
const path = require('path');

const app = express();
const api = require('./api/index');

app.use(vhost('api.localhost', api));

app.use(express.static('public'));
app.use(express.static('build'));


app.listen(8080, () => {console.log('Listening on port 8080')});
