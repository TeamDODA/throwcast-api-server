module.exports = {
  port: process.env.PORT || 3001,
  ip: process.env.IP,
  mongo: {
    uri: 'mongodb://localhost/throwcast-test',
  },
};
