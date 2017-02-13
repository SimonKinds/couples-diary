const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  couple: mongoose.Schema.Types.ObjectId,
  year: Number,
  month: Number,
  day: Number,
  entries: [{user: mongoose.Schema.Types.ObjectId, text: String}]
});

module.exports = mongoose.model('Diary', DiarySchema);
