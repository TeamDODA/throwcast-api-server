const db = require('../db');
const Promise = require('bluebird');
const Podcast = require('../api/podcast/podcast.model');
const Station = require('../api/station/station.model');
const User = require('../api/user/user.model');

module.exports.entitiesToIds = function entitiesToIds(entities) {
  return entities.map(entity => entity._id);
};

// Model creation helper functions

const stationRecords = function stationRecords(indices) {
  return indices.map(i => ({
    title: `Station${i}`,
    link: `https://station${i}.com`,
    feed: `https://station${i}.com/rss/uri`,
    image: `https://station${i}.com/image/uri`,
    updated: Date.now(),
    categories: {},
    description: { long: `Station${i} Description`, short: `Station${i}` },
  }));
};

module.exports.createStations = function createStations(n) {
  return Station.create(stationRecords(Array.from(new Array(n).keys())));
};

const podcastRecords = function podcastRecords(stations) {
  return stations.map((station, i) => ({
    title: `${station.title} Podcast`,
    guid: `${station} guid 1`,
    link: `${station.link}/podcast`,
    description: `${station.title} Podcast Description`,
    station: station._id,
    published: new Date(1471910547430 + i),
  }));
};

module.exports.podcastsForStations = function podcastsForStations(stations) {
  return Podcast.create(podcastRecords(stations));
};

module.exports.userRecords = function userRecords(indices) {
  return indices.map(i => ({
    username: `${i}`,
    password: `${i}`,
    provider: 'local',
  }));
};

module.exports.createUsers = function createUsers(n) {
  return User.create(module.exports.userRecords(Array.from(new Array(n).keys())));
};

const credentialsForUsers = function credentialsForUsers(users) {
  // NOTE: Uses the fact the test users' passwords are the same as the usernames.
  return users.map(user => ({ username: user.username, password: user.username }));
};

module.exports.tokensForUsers = function tokensForUsers(users, agent) {
  const promises = credentialsForUsers(users).map(credential => agent
    .post('/auth/local')
    .send(credential)
    .then(res => res.body.token));
  return Promise.all(promises);
};

// Setup and Teardown setup

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
