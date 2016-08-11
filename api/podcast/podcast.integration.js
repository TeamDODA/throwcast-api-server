const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const Podcast = require('./podcast.model');
const Station = require('../station/station.model');
const db = require('../../db');

const stations = [{
  title: 'station1',
  link: 'http://station1.com',
  description: 'fake station1',
}, {
  title: 'station2',
  link: 'http://station2.com',
  description: 'fake station2',
}];

const podcasts = [{
  title: 'station1 podcast1',
  link: 'http://station1.com/podcast1',
  description: 'station1 podcast1',
}, {
  title: 'station2 podcast1',
  link: 'http://station2.com/podcast1',
  description: 'station2 podcast1',
}];

describe('Podcast API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  let station1;
  let station2;
  let podcast1;
  let podcast2;
  beforeEach(() => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
    return Station.create(stations)
      .then(createdStations => ([station1, station2] = createdStations))
      .then(() => {
        podcasts[0].station = station1._id;
        podcasts[1].station = station2._id;
      })
      .then(() => Podcast.create(podcasts))
      .then(createdPodcasts => ([podcast1, podcast2] = createdPodcasts));
  });
  afterEach(() => cleanModels().then(() => server.close()));

  describe('GET /', () => {
    it('should return an array of all stations', () => request(server)
      .get('/api/podcasts')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        res.body.length.should.equal(2);
        res.body[0]._id.should.equal(podcast1.id);
        res.body[1]._id.should.equal(podcast2.id);
      }));
  });
});
