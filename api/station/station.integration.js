const request = require('supertest-as-promised');

const tu = require('../../utils/testing');

describe('Station API', () => {
  let agent;
  let server;
  let tokens;
  let users;
  beforeEach(() => tu.createStations(2)
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
    it('should return an array of all stations', () => agent
      .get('/api/stations')
      .set('authorization', `Bearer ${tokens[0]}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .should.eventually.have.property('body')
      .then(tu.entitiesToIds)
      .should.eventually.have.length(2));
  });
});
