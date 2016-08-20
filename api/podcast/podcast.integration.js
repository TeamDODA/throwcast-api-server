const request = require('supertest-as-promised');

const { entitiesToIds } = require('../../utils/testing');
const Podcast = require('./podcast.model');
const Station = require('../station/station.model');

describe('Podcast API', () => {
  let server;
  let agent;
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
      agent = request(server);
    }));
  afterEach(() => server.close());

  describe('GET /', () => {
    it('should respond with an array of all stations', () => agent
      .get('/api/podcasts')
      .expect(200)
      .expect('Content-Type', /json/)
      .should.eventually.have.property('body')
      .then(entitiesToIds)
      .should.eventually.have.length(2));

    it('should be sorted in descending createdAt order', () => agent
      .get('/api/podcasts')
      .should.eventually.have.property('body')
      .then(entitiesToIds)
      .should.eventually.be.eql([podcast2.id, podcast1.id]));
  });
});
