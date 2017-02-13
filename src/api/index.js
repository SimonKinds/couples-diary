const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());  // enable CORS across all API calls
// This might be needed for "complex" CORS calls
// app.options('*', cors());

// db
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connection.on('open', (ref) => console.log('Connected to mongodb'));
mongoose.connection.on(
    'error', (ref) => console.log('Error connecting to mongodb'));
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

module.exports = app;
