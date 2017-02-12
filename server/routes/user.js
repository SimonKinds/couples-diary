const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user.js');

router.post(
    '/', (request, response) => {User.create(request.body, (err, post) => {
           if (err) {
             console.log(err);
             response.send('Error')
           } else {
             response.json(post)
           }
         })});

module.exports = router;
