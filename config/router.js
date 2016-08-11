const api = require('../api');
const auth = require('../auth');

module.exports = app => {
  app.use('/auth', auth);
  app.use('/api', api);
};
