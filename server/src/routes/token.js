const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user.js');

const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

const jwtVerifyAsync = Promise.promisify(jwt.verify, { context: jwt });

router.post('/renew', (request, response) => {
  jwtVerifyAsync(request.headers.authorization, jwtConfig.key).then(token => {
    User.findOne({ _id: token.userId })
      .then(user => {
        if (user) {
          response.send(
            jwt.sign(
              {
                userId: user._id,
                username: user.username,
                coupleId: user.couple
              },
              jwtConfig.key,
              { expiresIn: '7d' }
            )
          );
        } else {
          response.status(404).send();
        }
      })
      .catch(e => {
        console.error(e);
        response.status(500).send();
      });
  });
});

module.exports = router;
