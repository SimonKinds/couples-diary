const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Diary = require('../models/diary.js');

// year and month is zero indexed
router.get('/:couple/:year/:month', (req, res) => {
  Diary.find(
      {
        couple: req.params.couple,
        year: req.params.year,
        month: req.params.month
      },
      (err, query_result) => {
        if (err) {
          console.log(err);
          res.json('error');
        } else {
          res.json(query_result);
        }
      });
});
router.get('/:couple/:year/:month/:day', (req, res) => {
  Diary.find(
      {
        couple: req.params.couple,
        year: req.params.year,
        month: req.params.month,
        day: req.params.day
      },
      (err, query_result) => {
        if (err) {
          console.log(err);
          res.json('error');
        } else {
          res.json(query_result);
        }
      });
});
router.post('/', (req, res) => {
  console.log(req.body);
  Diary.create(req.body, (err, post) => {
    if (err) {
      console.log(err);
      res.put('Error');
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
      res.put('Error');
    } else {
      res.json(post);
    }
  });
});
module.exports = router;
