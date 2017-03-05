const express = require('express');
const app = express();

// db
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/couples_diary');

// parse request bodies with json
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// set up API routes
const diary = require('./routes/diary');
app.use('/diary', diary);
const couple = require('./routes/couple');
app.use('/couple', couple);
const user = require('./routes/user');
app.use('/user', user);
const login = require('./routes/login');
app.use('/login', login);

app.use('/', (req, res) => res.status(404).send());

module.exports = app;
