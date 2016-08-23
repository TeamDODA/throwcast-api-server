const request = require('supertest-as-promised');

const tu = require('../../utils/testing');

describe('Podcast API', () => {
  let agent;
  let podcasts;
  let server;
  beforeEach(() => tu.createStations(2)
    .then(tu.podcastsForStations)
    .then(created => (podcasts = created))
    .then(() => {
      delete require.cache[require.resolve('../../server')];
      const app = require('../../server');

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
      .then(tu.entitiesToIds)
      .should.eventually.have.length(2));

    it('should be sorted in descending published order', () => agent
      .get('/api/podcasts')
      .should.eventually.have.property('body')
      .then(tu.entitiesToIds)
      .should.eventually.be.eql([podcasts[1].id, podcasts[0].id]));
  });
});
