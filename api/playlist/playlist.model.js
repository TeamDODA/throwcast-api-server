const mongoose = require('mongoose');

const oid = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: oid, required: true, ref: 'User' },
  podcasts: [{ type: oid, ref: 'Podcast' }],
}, {
  timestamps: true,
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
