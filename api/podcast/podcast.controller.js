const u = require('../../utils');
const Podcast = require('./podcast.model');

const controller = {};

controller.list = (req, res) => {
  Podcast.find({})
    .sort({ published: -1 })
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
