const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
