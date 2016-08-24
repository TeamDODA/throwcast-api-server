const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const oid = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true, es_indexed: true },
  owner: { type: oid, required: true, ref: 'User' },
  podcasts: [{ type: oid, ref: 'Podcast' }],
}, {
  timestamps: true,
});

playlistSchema.plugin(mongoosastic);

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
