const mongoose = require('mongoose');

const oid = mongoose.Schema.Types.ObjectId;

const podcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  pubDate: { type: Date },
  imageUrl: { type: String },
  station: { type: oid, required: true, ref: 'Station' },
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
