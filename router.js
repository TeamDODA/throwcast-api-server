const userRouter = require('./api/user');
const api = require('./api');

module.exports = app => {
  app.use('/user', userRouter);
  app.use('/api', api);
};
