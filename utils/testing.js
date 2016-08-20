const db = require('../db');
const Promise = require('bluebird');

module.exports.entitiesToIds = function entitiesToIds(entities) {
  return entities.map(entity => entity._id);
};

beforeEach(() => { // eslint-disable-line no-undef
  function clearDB() {
    const collections = Object.keys(db.connection.collections);
    return Promise.all(collections.map(name => db.connection.collections[name].remove()));
  }
  if (db.connection.readyState === 0) {
    return db.connect().then(clearDB);
  }
  return clearDB();
});

afterEach(done => { // eslint-disable-line no-undef
  db.connection.close();
  return done();
});
