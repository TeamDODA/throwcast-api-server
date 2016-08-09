const userRouter = require('./api/user');

module.exports = app => {
  app.use('/user', userRouter);
};
