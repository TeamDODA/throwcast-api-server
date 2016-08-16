const { handleError } = require('../../utils');
const Playlist = require('./playlist.model');

const controller = {};

controller.lists = (req, res) => {
  Playlist.find({}).exec()
    .then(playlists => res.json({ data: playlists }))
    .catch(handleError(res));
};

controller.show = (req, res) => {
  const id = req.params.playlistId;
  Playlist.findById(id).exec()
    .then(playlist => res.json({ data: playlist }))
    .catch(handleError(res));
};

controller.create = (req, res) => {
  const { name, owner, podcast } = req.body;
  Playlist.create({ name, owner })
    .then(playlist => {
      playlist.podcasts.push(podcast);
      return playlist.save();
    })
    .then(playlist => res.json(playlist))
    .catch(handleError(res));
};

controller.delete = (req, res) => {
  Playlist.remove({ _id: req.params.playlistId })
    .then(() => res.sendStatus(202))
    .catch(handleError(res));
};

controller.addPodcast = (req, res) => {
  Playlist.findById(req.params.playlistId).exec()
    .then(list => {
      list.podcasts.push(req.body.podcastId);
      return list.save();
    })
    .then(() => res.sendStatus(200))
    .catch(handleError(res));
};

controller.removePodcast = (req, res) => {
  const { playlistId, podcastId } = req.params;
  Playlist.update(
    { _id: playlistId },
    { $pull: { podcasts: podcastId } }
    ).exec()
    .then(response => {
      if (response.nModified > 0) {
        return res.sendStatus(202);
      }
      return res.send('podcast not found');
    })
    .catch(handleError(res));
};

module.exports = controller;
