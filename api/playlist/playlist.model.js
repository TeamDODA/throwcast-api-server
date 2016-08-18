const mongoose = require('mongoose');

const oid = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: oid, required: true, ref: 'User' },
  podcasts: [{ type: oid, ref: 'Podcast', unique: true }],
}, {
  timestamps: true,
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
