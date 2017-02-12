const express = require('express');
const app = express();

// db
const mongoose = require('mongoose');
mongoose.connection.on('open', (ref) => console.log('Connected to mongodb'));
mongoose.connection.on(
    'error', (ref) => console.log('Error connecting to mongodb'));
mongoose.connect('mongodb://localhost/couples_diary');

// set up Express
// enable sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// TODO: update the secret
app.use(session({
  secret: 'key to sign the cookie',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,            // don't write to db if no changes have been made
  saveUninitialized: false  // don't save new but non-existing sessions
}));

// parse request bodies with json
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// set up API routes
const diary = require('./routes/diary');
app.use('/diary', diary);
const user = require('./routes/user');
app.use('/user', user);
const login = require('./routes/login');
app.use('/login', login);

app.listen(8080, () => {console.log('Listening on port 8080')});
