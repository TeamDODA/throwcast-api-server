const { handleError } = require('../../utils');
const Playlist = require('./playlist.model');

const controller = {};

controller.lists = (req, res) => {
  Playlist.find({})
    .populate('podcasts')
    .exec()
    .then(playlists => res.json({ data: playlists }))
    .catch(handleError(res));
};

controller.create = (req, res) => {
  const { name, podcast } = req.body;
  Playlist.create({ name, owner: req.user._id, podcasts: [podcast].filter(Boolean) })
    .then(playlist => res.json(playlist))
    .catch(handleError(res));
};

controller.show = (req, res) => {
  res.json(req.playlist);
};

controller.delete = (req, res) => {
  Playlist.remove(req.playlist)
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
