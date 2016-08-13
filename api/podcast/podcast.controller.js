const { handleError } = require('../../utils');
const Podcast = require('./podcast.model');

const controller = {};

controller.list = (req, res) => {
  Podcast.find({}).exec()
    .then(podcasts => res.json({ data: podcasts }))
    .catch(handleError(res));
};

module.exports = controller;
