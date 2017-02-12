const mongoose = require('mongoose');

const CoupleSchema =
    new mongoose.Schema({name: String, users: [mongoose.Schema.Types.ObjectId]})

module.exports = mongoose.model('Couple', CoupleSchema);
