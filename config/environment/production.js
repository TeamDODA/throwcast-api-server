module.exports = {
  port: process.env.PORT || 8080,
  ip: process.env.IP,
  mongo: {
    uri: 'mongodb://localhost/throwcast',
  },
};
