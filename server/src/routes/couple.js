const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Couple = require('../models/couple');
const User = require('../models/user');

const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

const jwtVerifyAsync = Promise.promisify(jwt.verify, { context: jwt });

const NO_COUPLE_ERROR = 'no couple';
const NOT_IN_COUPLE_ERROR = 'not in couple';

function isJwtError(err) {
  return err.name && err.name == 'JsonWebTokenError';
}

router.post('/create', (req, res) => {
  const decodedToken = isValidToken(req.headers.authorization);
  if (!decodedToken) {
    res.status(401).send();
    return;
  }

  const coupleName = req.body.name;
  if (!coupleName) {
    res.status(400).send();
    return;
  }

  // if it was a valid token, it's a valid user
  Couple.create({ name: coupleName, users: [decodedToken.userId] })
    .then(couple => {
      return User.findByIdAndUpdate(decodedToken.userId, {
        couple: couple._id
      });
    })
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      console.error(e);
      res.status(400).send();
    });
});

router.get('/:id', (req, res) => {
  const token = req.headers.authorization;
  jwtVerifyAsync(token, jwtConfig.key)
    .then(decodedToken => {
      const coupleId = req.params.id;

      if (coupleId != decodedToken.coupleId) {
        throw new Error(NOT_IN_COUPLE_ERROR);
      }

      return Couple.findOne({ _id: coupleId })
        .populate('users')
        .then(couple => {
          if (!couple) {
            throw new Error(NO_COUPLE_ERROR);
          }
          const thisUserIndex = couple.users.findIndex(
            user => user.id == decodedToken.userId
          );
          const thisUser = couple.users[thisUserIndex];
          const otherUser = couple.users[(thisUserIndex + 1) % 2];

          res.status(200).json({
            id: couple._id,
            thisUser: {
              id: thisUser._id,
              username: thisUser.username,
              color: thisUser.color
            },
            otherUser: {
              id: otherUser._id,
              username: otherUser.username,
              color: otherUser.color
            }
          });
        });
    })
    .catch(e => {
      console.log(e.message);
      let status = 500; // server error (db crash)
      if (isJwtError(e) || e.message == NOT_IN_COUPLE_ERROR) {
        status = 401; // unauthorized
      } else if (e.message == NO_COUPLE_ERROR) {
        status = 404; // couple was not found
      }
      res.status(status).send();
    });
});

function isValidToken(token) {
  try {
    const decoded = jwt.verify(token, jwtConfig.key);
    return decoded;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = router;
