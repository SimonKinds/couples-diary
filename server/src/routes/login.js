const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user.js');

const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

router.post('/', (request, response) => {
  const username = request.body.username;
  User.findOne({username: username})
      .then(user => {
        if (user) {
          const token = jwt.sign(
              {userId: user._id, username: user.username, coupleId: user.couple}, jwtConfig.key,
              {expiresIn: '7d'});
          response.send(token);
        } else {
          response.status(404).send();
        }
      })
      .catch(e => {
        console.error(e);
        response.status(500).send();
      });
});

module.exports = router;
