const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);
const cipher = Promise.promisify(bcrypt.hash);
const compare = Promise.promisify(bcrypt.compare);

User.comparePassword = (candidatePw, savedPw) => compare(candidatePw, savedPw);

userSchema.pre('save', function (next) {
  cipher(this.password, null, null).bind(this)
    .then(hash => {
      this.password = hash;
      next();
    });
});

module.exports = User;
