const request = require('supertest-as-promised');
const Station = require('./station.model');
const db = require('../../db');

describe('Station API', () => {
  before(db.connect);
  after(() => db.connection.close());

  let server;
  beforeEach(() => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
  });
  afterEach(done => server.close(done));

  describe('GET /', () => {
    const stationRecords = [{
      title: 'station 1',
      link: 'http://station.one.com',
      description: 'The first station.',
    }, {
      title: 'station 2',
      link: 'http://station.two.com',
      description: 'The second station.',
    }];

    beforeEach(() => Station.create(stationRecords));

    it('should return an array of all stations', () => request(server)
      .get('/api/stations')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.length.should.equal(2)));
  });
});
