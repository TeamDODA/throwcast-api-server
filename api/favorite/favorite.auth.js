const { handleError, handleEntityNotFound, decorateRequest } = require('../../utils');
const Favorite = require('./favorite.model');

const auth = {};

auth.populateReqFavorite = function populateReqFavorite(req, res, next) {
  return Favorite.findById(req.params.favoriteId)
    .then(handleEntityNotFound(res))
    .then(decorateRequest(req, 'favorite', next))
    .catch(handleError(res));
};

auth.isOwner = function isOwner(req, res, next) {
  if (req.favorite.user.equals(req.user._id)) {
    return next();
  }
  return res.sendStatus(403);
};

auth.isFavoriteOwner = [auth.populateReqFavorite, auth.isOwner];

module.exports = auth;
