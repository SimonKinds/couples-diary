const express = require('express');
const router = express.Router();
const hasher = require('../util/hasher');

const mongoose = require('mongoose');
const User = require('../models/user.js');

const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

router.post('/', (request, response) => {
  const { username, password } = request.body;

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        const hashedPassword = hasher.hashPassword(password, user.salt);

        if (hashedPassword != user.password) {
          response.status(404).send();
        } else {
          const token = jwt.sign(
            {
              userId: user._id,
              username: user.username,
              coupleId: user.couple
            },
            jwtConfig.key,
            { expiresIn: '7d' }
          );
          response.send(token);
        }
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
