const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const Podcast = require('./podcast.model');
const Station = require('../station/station.model');
const db = require('../../db');

describe('Podcast API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  let station1;
  let station2;
  let podcast1;
  let podcast2;
  beforeEach(() => Station
    .create([{
      title: 'station1',
      link: 'http://station1.com',
      description: 'fake station1',
    }, {
      title: 'station2',
      link: 'http://station2.com',
      description: 'fake station2',
    }])
    .then(created => ([station1, station2] = created))
    .then(() => Podcast.create({
      title: 'station1 podcast1',
      link: 'https://station1.com/podcast1',
      description: 'station1 podcast1',
      station: station1._id,
    }))
    .then(created => (podcast1 = created))
    .then(() => Podcast.create({
      title: 'station2 podcast1',
      link: 'https://station2.com/podcast1',
      description: 'station2 podcast1',
      station: station2._id,
    }))
    .then(created => (podcast2 = created))
    .then(() => {
      const app = require('../../server', { bustCache: true });
      server = app.listen(app.get('port'), app.get('ip'));
    }));
  afterEach(() => cleanModels().then(() => server.close()));

  describe('GET /', () => {
    it('should respond with an array of all stations', () => request(server)
      .get('/api/podcasts')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.data.length.should.equal(2)));

    it('should be sorted in descending createdAt order', () => request(server)
      .get('/api/podcasts')
      .then(res => {
        res.body.data[0]._id.should.equal(podcast2.id);
        res.body.data[1]._id.should.equal(podcast1.id);
      }));
  });
});
