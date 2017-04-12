const express = require('express');
const router = express.Router();

const hasher = require('../util/hasher');

const mongoose = require('mongoose');
const User = require('../models/user.js');

router.post('/create', (request, response) => {
  const username = request.body.username;
  if (!username) {
    response.status(400).send({ reason: 'Missing username' });
  } else {
    User.findOne({ username: username }, (err, db_response) => {
      if (err) {
        response.status(500).send(err);
      } else if (db_response) {
        // this username already exists
        response.status(409).send();
      } else {
        const salt = createSalt();
        const password = hashPassword(request.body.password, salt);
        User.create({ username, password, salt }, (err, post) => {
          if (err) {
            response.status(500).send(err);
          } else {
            response.status(200).send();
          }
        });
      }
    });
  }
});

function createSalt() {
  const length_bytes = 32;
  return crypto.randomBytes(length_bytes).toString('hex');
}
module.exports = router;
