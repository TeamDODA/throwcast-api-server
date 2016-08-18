const u = require('../../utils');
const Playlist = require('./playlist.model');
const Podcast = require('../podcast/podcast.model');


const controller = {};

controller.lists = (req, res) => {
  Playlist.find({})
    .populate('podcasts')
    .exec()
    .then(playlists => res.json({ data: playlists }))
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

controller.addPodcast = (req, res) => {
  Podcast.findById(req.body.podcastId).exec()
    .then(u.handleEntityNotFound(res))
    .then(entity => {
      if (entity) {
        const query = { _id: req.playlist._id, podcasts: { $ne: entity._id } };
        const opts = { $push: { podcasts: entity._id } };
        return Playlist.update(query, opts).exec()
          .then(summary => {
            if (summary.ok && !summary.nModified) {
              throw new Error('Podcast already in playlist');
            }
            return entity;
          })
          .catch(u.handleError(res, 400));
      }
      return null;
    })
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

controller.removePodcast = (req, res) => {
  u.safeObjectIdCast(req.params.podcastId)
    .then(podcastId => {
      if (req.playlist.podcasts.indexOf(podcastId) > -1) {
        req.playlist.podcasts.pull(podcastId);
        req.playlist.save()
          .then(() => res.sendStatus(202))
          .catch(u.handleError(res));
      } else {
        u.handleError(res, 404)(new Error('Podcast not in playlist'));
      }
    })
    .catch(u.handleError(res, 400));
};

module.exports = controller;
