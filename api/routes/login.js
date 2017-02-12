const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user.js');

router.post('/', (request, response) => {
  User.findOne({username: request.body.username}, (err, db_response) => {
    if (err) {
      console.log(err);
      response.send('Error');
    } else if (!db_response) {
      response.send('Could not find user');
    } else {
      request.session.user_id = db_response._id;
      console.log(request.session);
      response.redirect('/login/success');
    }
  });
});

router.get('/success', (request, response) => {
  console.log(request.session);
  User.findOne({_id: request.session.user_id}, (err, db_response) => {
    response.send('User with above ID has username: ' + db_response.username);
  });
});

module.exports = router;
