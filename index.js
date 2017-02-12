const express = require('express');
const vhost = require('vhost');

const app = express();
const api = require('./api/index');

app.use(vhost('api.localhost', api));

app.listen(8080, () => {console.log('Listening on port 8080')});
