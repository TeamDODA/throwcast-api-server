const { handleError } = require('../../utils');
const User = require('./user.model');

const auth = {};

auth.populateReqUser = function populateReqUser(req, res, next) {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(401).end();
      }
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(handleError(res));
};

module.exports = auth;
