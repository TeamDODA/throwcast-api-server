const mongoose = require('mongoose');

const oid = mongoose.Schema.Types.ObjectId;

const podcastSchema = new mongoose.Schema({
  station: { type: oid, required: true, ref: 'Station', index: true },
  guid: { type: String, required: true, index: true },
  title: { type: String, required: true },
  published: Date,
  duration: Number,
  categories: {},
  description: String,
  enclosure: {},
  image: String,
}, {
  timestamps: true,
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
