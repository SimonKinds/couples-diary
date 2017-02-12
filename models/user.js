const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {username: String, first_name: String, last_name: String});

module.exports = mongoose.model('User', UserSchema);
