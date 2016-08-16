const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const providers = ['local'];
const oid = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  provider: { type: String, required: true, enum: providers },
  subscriptions: [{ type: oid, required: true, ref: 'Station', unique: true }],
});

const User = mongoose.model('User', userSchema);
const cipher = Promise.promisify(bcrypt.hash);
const compare = Promise.promisify(bcrypt.compare);

User.comparePassword = (candidatePw, savedPw) => compare(candidatePw, savedPw);

userSchema.pre('save', function preSave(next) {
  cipher(this.password, null, null).bind(this)
    .then(hash => (this.password = hash))
    .then(next);
});

module.exports = User;
