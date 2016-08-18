const { handleError } = require('../../utils');
const { isAuthenticated } = require('../../auth/auth.service');
const Playlist = require('./playlist.model');

const auth = {};

auth.populateReqPlaylist = function populateReqPlaylist(req, res, next) {
  return Playlist.findById(req.params.playlistId)
    .populate('podcasts')
    .then(playlist => {
      if (!playlist) {
        return res.sendStatus(404);
      }
      req.playlist = playlist; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(handleError(res));
};

auth.isOwner = function isOwner(req, res, next) {
  if (req.playlist.owner.equals(req.user._id)) {
    return next();
  }
  return res.sendStatus(403);
};

// TODO: Remove isAuthenticated when all routes require authentication.
auth.isPlaylistOwner = [isAuthenticated, auth.populateReqPlaylist, auth.isOwner];

module.exports = auth;
