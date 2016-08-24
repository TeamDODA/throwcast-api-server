module.exports = {
  port: process.env.PORT || 8080,
  ip: process.env.IP,
  mongo: {
    uri: process.env.MONGO_URL || 'mongodb://localhost/throwcast',
  },
  elastic: {
    hosts: process.env.ELASTICSEARCH_URL ? [process.env.ELASTICSEARCH_URL] : undefined,
  },
};
