const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  couple: {type: mongoose.Schema.Types.ObjectId, ref: 'Couple'},
  year: Number,
  month: Number,
  day: Number,
  entries: [{user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: String}]
});

module.exports = mongoose.model('Diary', DiarySchema);
