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
const INVALID_REQUEST = 'invalid request';

function isJwtError(err) {
  return err.name && err.name == 'JsonWebTokenError';
}

// year and month is zero indexed
// coupleId should be a query
router.get('/:year/:month', (req, res) => {
  const token = req.headers.authorization;
  jwtVerifyAsync(token, jwtConfig.key)
      // make sure this person is in the set couple
      .then(
          decodedToken => {
            const coupleId = req.query.coupleId
              return Couple.findOne({_id: coupleId})
                  .then(couple => {
                    if (!couple) {
                      throw new Error(NON_EXISTANT_COUPLE);
                    } else if (
                        couple.users.indexOf(decodedToken.userId) == -1) {
                      throw new Error(NOT_IN_COUPLE_ERROR);
                    }
                    return Diary.find({
                      couple: coupleId,
                      year: parseInt(req.params.year),
                      month: parseInt(req.params.month)
                    })
                    .populate('entries.user')
                  })
                  .then(days => { res.status(200).json(days); })})
      .catch(e => {
        console.error(e);
        let status = 500;  // server error (db crash)
        if (isJwtError(e) || e.message == NOT_IN_COUPLE_ERROR) {
          status = 401;  // unauthorized
        } else if (e.message == NON_EXISTANT_COUPLE) {
          status = 404;  // couple was not found
        }
        res.status(status).send();
      });
});

router.post('/create', (req, res) => {
  jwtVerifyAsync(req.headers.authorization, jwtConfig.key)
      .then(decodedToken => {
        const couple = req.body.couple;
        const year = req.body.year;
        const month = req.body.month;
        const day = req.body.day;
        const text = req.body.text;

        if (!couple || !year || !month || !day || !text) {
          throw new Error(INVALID_REQUEST);
        }

        return Diary.create({
          couple: couple,
          year: year,
          month: month,
          day: day,
          entries: [{user: decodedToken.userId, text: text}]
        });
      })
      .then(entry => res.status(200).send())
      .catch(err => {
        console.error(err);
        let status = 500;
        if (isJwtError(err)) {
          status = 401;
        } else if (err.message == INVALID_REQUEST) {
          status = 400;
        }
        res.status(status).send();
      });
});

module.exports = router;
