const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  link: { type: String, required: true },
  image: String,
  description: {},
  updated: Date,
  categories: {},
  feed: { type: String, required: true },
}, {
  timestamps: true,
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
