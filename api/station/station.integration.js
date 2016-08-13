const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const Station = require('./station.model');
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

describe('Station API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  beforeEach(() => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
  });
  afterEach(done => server.close(done));

  describe('GET /', () => {
    beforeEach(() => Station.create(stations));

    it('should return an array of all stations', () => request(server)
      .get('/api/stations')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.data.length.should.equal(2)));
  });
});
