const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String
});

module.exports = mongoose.model('Entry', EntrySchema);
