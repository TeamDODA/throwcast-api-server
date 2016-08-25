const u = require('../../../utils');
const Playlist = require('../../playlist/playlist.model');

const controller = {};

controller.list = function create(req, res) {
  Playlist.find({ owner: req.user._id })
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
