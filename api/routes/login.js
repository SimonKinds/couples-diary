const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user.js');

const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

router.post('/', (request, response) => {
  const username = request.body.username;
  User.findOne({username: username}, (err, db_response) => {
    if (err) {
      console.error(err);
      response.status(500).send();
    } else if (!db_response) {
      response.status(404).send();
    } else {
      const id = db_response._id;
      const token = jwt.sign({username: username, userId: id}, jwtConfig.key);
      response.status(200).send(token);
    }
  });
});

module.exports = router;
