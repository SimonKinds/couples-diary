const mongoose = require('mongoose');

const CoupleSchema =
    new mongoose.Schema({name: String, users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})

module.exports = mongoose.model('Couple', CoupleSchema);
