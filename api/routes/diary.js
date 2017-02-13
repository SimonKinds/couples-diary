const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Diary = require('../models/diary');
const Couple = require('../models/couple');

const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

const jwtVerifyAsync = Promise.promisify(jwt.verify, {context: jwt});

const NON_EXISTANT_COUPLE = 'couple does not exists';
const NOT_IN_COUPLE_ERROR = 'not in couple';

function isJwtError(err) {
  return err.name || err.name == 'JsonWebTokenError';
}

// year and month is zero indexed
router.get('/:coupleId/:year/:month', (req, res) => {
  const token = req.headers.authorization;
  jwtVerifyAsync(token, jwtConfig.key)
      // make sure this person is in the set couple
      .then(
          decodedToken => {
              return Couple.findOne({_id: req.params.coupleId})
                  .then(couple => {
                    if (!couple) {
                      throw new Error(NON_EXISTANT_COUPLE);
                    } else if (
                        couple.users.indexOf(decodedToken.userId) == -1) {
                      throw new Error(NOT_IN_COUPLE_ERROR);
                    }

                    return Diary.find({
                      couple: req.params.coupleId,
                      year: req.params.year,
                      month: req.params.month
                    });
                  })
                  .then(overview => { res.status(200).json(overview); })})
      .catch(e => {
        console.error(e);
        let status = 500;  // server error (db crash)
        if (isJwtError(e) || e == NOT_IN_COUPLE_ERROR ||
            e == NON_EXISTANT_COUPLE) {
          status = 401;  // unauthorized
        }
        res.status(status).send();
      });
});

router.post('/', (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, jwtConfig.key, (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(401).send();
      return;
    }
  });

  Diary.create(req.body, (err, post) => {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      res.json(post);
    }
  });
});

router.put('/:id', (req, res) => {
  console.log(req.body);
  Diary.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      res.json(post);
    }
  });
});
module.exports = router;
