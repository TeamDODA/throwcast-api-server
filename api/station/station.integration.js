const request = require('supertest-as-promised');

const { entitiesToIds } = require('../../utils/testing');
const Station = require('./station.model');

describe('Station API', () => {
  let server;
  let agent;
  beforeEach(() => Station
    .create([{
      title: 'station1',
      link: 'http://station1.com',
      feed: 'http://station1.com/feed',
      description: { long: 'fake station1' },
    }, {
      title: 'station2',
      link: 'http://station2.com',
      feed: 'http://station2.com/feed',
      description: { long: 'fake station2' },
    }])
    .then(() => {
      const app = require('../../server', { bustCache: true });
      server = app.listen(app.get('port'), app.get('ip'));
      agent = request(server);
    }));
  afterEach(done => server.close(done));

  describe('GET /', () => {
    it('should return an array of all stations', () => agent
      .get('/api/stations')
      .expect(200)
      .expect('Content-Type', /json/)
      .should.eventually.have.property('body')
      .then(entitiesToIds)
      .should.eventually.have.length(2));
  });
});
