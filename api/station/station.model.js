const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const stationSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, es_indexed: true },
  link: { type: String, required: true },
  image: String,
  description: {},
  updated: Date,
  categories: {},
  feed: { type: String, required: true, unique: true },
}, {
  timestamps: true,
});

stationSchema.plugin(mongoosastic);

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
