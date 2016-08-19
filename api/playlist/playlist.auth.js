const { handleError, handleEntityNotFound, decorateRequest } = require('../../utils');
const Playlist = require('./playlist.model');

const auth = {};

auth.populateReqPlaylist = function populateReqPlaylist(req, res, next) {
  return Playlist.findById(req.params.playlistId)
    .then(handleEntityNotFound(res))
    .then(decorateRequest(req, 'playlist', next))
    .catch(handleError(res));
};

auth.isOwner = function isOwner(req, res, next) {
  if (req.playlist.owner.equals(req.user._id)) {
    return next();
  }
  return res.sendStatus(403);
};

auth.isPlaylistOwner = [auth.populateReqPlaylist, auth.isOwner];

module.exports = auth;
