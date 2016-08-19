const u = require('../../utils');
const Playlist = require('./playlist.model');

const controller = {};

controller.lists = function list(req, res) {
  Playlist.find({})
    .populate('podcasts').exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.create = function create(req, res) {
  const opts = [{ path: 'podcasts', model: 'Podcast' }];
  const { name, podcasts } = req.body;
  const owner = req.user._id;
  Playlist.create({ name, owner, podcasts })
    .then(created => Playlist.populate(created, opts))
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.show = (req, res) => {
  const opts = [{ path: 'podcasts', model: 'Podcast' }];
  Playlist.populate(req.playlist, opts)
    .then(playlist => res.json(playlist))
    .catch(u.handleError(res));
};

controller.delete = (req, res) => {
  Playlist.remove(req.playlist)
    .then(() => res.sendStatus(202))
    .catch(u.handleError(res));
};

controller.update = function update(req, res) {
  const sanitized = u.sanitizedUpdate(req.body, ['_id', 'owner']);
  const opts = { upsert: true, setDefaultsOnInsert: true, runValidators: true, new: true };
  Playlist
    .findOneAndUpdate(req.playlist.id, sanitized, opts)
    .populate('podcasts').exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
