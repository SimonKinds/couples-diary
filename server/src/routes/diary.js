const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Diary = require('../models/diary');
const Couple = require('../models/couple');
const Entry = require('../models/entry');

const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../jwt_config');

const jwtVerifyAsync = Promise.promisify(jwt.verify, { context: jwt });

const NON_EXISTANT_COUPLE = 'couple does not exists';
const NOT_IN_COUPLE_ERROR = 'not in couple';
const INVALID_REQUEST = 'invalid request';

function isJwtError(err) {
  return err.name && err.name == 'JsonWebTokenError';
}

// month is zero indexed
// coupleId should be a query
router.get('/:year/:month', (req, res) => {
  const token = req.headers.authorization;
  jwtVerifyAsync(token, jwtConfig.key)
    // make sure this person is in the set couple
    .then(decodedToken => {
      const coupleId = req.query.coupleId;
      return Couple.findOne({ _id: coupleId })
        .then(couple => {
          if (!couple) {
            throw new Error(NON_EXISTANT_COUPLE);
          } else if (couple.users.indexOf(decodedToken.userId) == -1) {
            throw new Error(NOT_IN_COUPLE_ERROR);
          }
          return Diary.find({
            couple: coupleId,
            year: parseInt(req.params.year),
            month: parseInt(req.params.month)
          }).populate('entries');
        })
        .then(days => res.status(200).json(days));
    })
    .catch(e => {
      console.error(e);
      let status = 500; // server error (db crash)
      if (isJwtError(e) || e.message == NOT_IN_COUPLE_ERROR) {
        status = 401; // unauthorized
      } else if (e.message == NON_EXISTANT_COUPLE) {
        status = 404; // couple was not found
      }
      res.status(status).send();
    });
});

router.post('/create', (req, res) => {
  jwtVerifyAsync(req.headers.authorization, jwtConfig.key)
    .then(decodedToken => {
      const { userId } = decodedToken;
      const { couple, entryId, year, month, day, text } = req.body;

      if (couple != decodedToken.coupleId) {
        throw new Error(NOT_IN_COUPLE_ERROR);
      }

      if (!couple || !year || !month || !day || !text) {
        throw new Error(INVALID_REQUEST);
      }

      return Diary.findOne({
        couple,
        year,
        month,
        day
      })
        .populate('entries')
        .then(day => {
          const { entries } = day;
          const thisUserEntry = entries.filter(e => e.user == userId)[0];

          if (thisUserEntry) {
            return Entry.update(
              {
                _id: thisUserEntry._id
              },
              { $set: { text } },
              { upsert: true }
            ).then(_ => {
              return {_id: thisUserEntry._id, user: userId, text};
            });
          } else {
            return Entry.create({
              user: userId,
              text: text
            }).then(entry => {
              return Diary.update(
                {
                  couple: couple,
                  year: year,
                  month: month,
                  day: day.day
                },
                { $push: { entries: entry._id } },
                { upsert: true }
                // we want to return the entry
              ).then(day => entry);
            });
          }
        });
    })
    .then(day => res.status(200).send(day))
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
