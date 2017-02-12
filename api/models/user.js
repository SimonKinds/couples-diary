const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {username: String, couple: mongoose.Schema.Types.ObjectId});

module.exports = mongoose.model('User', UserSchema);
