const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {username: String, password: String, salt: String, color: String, couple: {type: mongoose.Schema.Types.ObjectId, ref: 'Couple'}});

module.exports = mongoose.model('User', UserSchema);
