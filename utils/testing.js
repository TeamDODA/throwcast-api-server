const Podcast = require('../api/podcast/podcast.model');
const Station = require('../api/station/station.model');
const User = require('../api/user/user.model');

module.exports.cleanModels = () => Podcast.remove()
  .then(() => Station.remove())
  .then(() => User.remove());
