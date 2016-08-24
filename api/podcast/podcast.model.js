const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const oid = mongoose.Schema.Types.ObjectId;

const podcastSchema = new mongoose.Schema({
  guid: { type: String, required: true },
  title: { type: String, required: true, es_indexed: true },
  published: Date,
  duration: Number,
  categories: {},
  description: String,
  enclosure: {},
  image: String,
  station: { type: oid, required: true, ref: 'Station', index: true },
}, {
  timestamps: true,
});

podcastSchema.index({ station: 1, guid: 1 }, { unique: true });
podcastSchema.plugin(mongoosastic);

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
