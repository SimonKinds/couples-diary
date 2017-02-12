const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Couple = require('../models/couple');
const User = require('../models/user');

const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

router.post('/create', (req, res) => {
  const decodedToken = isValidToken(req.get('Authorization'));
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
  Couple.create({name: coupleName, users: [decodedToken.userId]})
      .then((couple) => {
        return User.findByIdAndUpdate(
            decodedToken.userId, {couple: couple._id});
      })
      .then(() => {res.status(200).send()})
      .catch((e) => {
        console.error(e);
        res.status(400).send()
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
};

module.exports = router;
