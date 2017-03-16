const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  couple: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple' },
  year: Number,
  month: Number,
  day: Number,
  entries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }]
});

module.exports = mongoose.model('Diary', DiarySchema);
