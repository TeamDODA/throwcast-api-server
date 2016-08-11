const mongoose = require('mongoose');

const oid = mongoose.Schema.Types.ObjectId;

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: false },
  owner: { type: oid, required: true, ref: 'User' },
  podcasts: [ { type: oid, required: true, ref: 'Podcasts' } ],
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
