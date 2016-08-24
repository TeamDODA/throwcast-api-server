const mongoose = require('mongoose');

const oid = mongoose.Schema.Types.ObjectId;
const types = ['playlists', 'podcasts', 'stations'];

const favoriteSchema = new mongoose.Schema({
  from: { type: String, enum: types, required: true },
  localField: { type: oid, required: true },
  user: { type: oid, required: true, ref: 'User' },
}, {
  timestamps: true,
});

favoriteSchema.index({ localField: 1, from: 1 });
favoriteSchema.index({ localField: 1, from: 1, user: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
