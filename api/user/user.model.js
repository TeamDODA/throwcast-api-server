const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const cipher = Promise.promisify(bcrypt.hash);
const compare = Promise.promisify(bcrypt.compare);

const providers = ['local'];
const oid = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  provider: { type: String, required: true, enum: providers },
  subscriptions: [{ type: oid, required: true, ref: 'Station', unique: true }],
});

UserSchema
  .path('password')
  .validate(password => password.length, 'Password cannot be blank');

UserSchema
  .path('username')
  .validate(function usernameAvailable(value, respond) {
    return this.constructor.findOne({ username: value }).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      });
  }, 'Username is already in use');

UserSchema
  .pre('save', function preSave(next) {
    cipher(this.password, null, null).bind(this)
      .then(hash => (this.password = hash))
      .then(next);
  });

const User = mongoose.model('User', UserSchema);

User.comparePassword = (candidatePw, savedPw) => compare(candidatePw, savedPw);

module.exports = User;
