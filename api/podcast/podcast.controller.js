const u = require('../../utils');
const Podcast = require('./podcast.model');

const controller = {};

controller.list = (req, res) => {
  Podcast.find({}).sort('-createdAt').exec()
    .then(u.respondWithResult(res))
    .catch(u.handleError(res));
};

module.exports = controller;
