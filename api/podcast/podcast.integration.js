const request = require('supertest-as-promised');

const tu = require('../../utils/testing');

describe('Podcast API', () => {
  let agent;
  let podcasts;
  let server;
  let tokens;
  let users;
  beforeEach(() => tu.createStations(2)
    .then(tu.podcastsForStations)
    .then(created => (podcasts = created))
    .then(() => tu.createUsers(1))
    .then(created => (users = created))
    .then(() => {
      delete require.cache[require.resolve('../../server')];
      const app = require('../../server');

      server = app.listen(app.get('port'), app.get('ip'));
      return (agent = request(app));
    })
    .then(() => tu.tokensForUsers(users, agent))
    .then(created => (tokens = created)));
  afterEach(() => server.close());

  describe('GET /', () => {
    it('should respond with an array of all stations', () => agent
      .get('/api/podcasts')
      .set('authorization', `Bearer ${tokens[0]}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .should.eventually.have.property('body')
      .then(tu.entitiesToIds)
      .should.eventually.have.length(2));

    it('should be sorted in descending published order', () => agent
      .get('/api/podcasts')
      .set('authorization', `Bearer ${tokens[0]}`)
      .should.eventually.have.property('body')
      .then(tu.entitiesToIds)
      .should.eventually.be.eql([podcasts[1].id, podcasts[0].id]));
  });
});
