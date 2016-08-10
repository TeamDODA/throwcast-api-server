const request = require('supertest-as-promised');
const db = require('./db');

describe('Server', () => {
  before(db.connect);
  after(() => db.connection.close());

  let server;
  beforeEach(() => {
    const app = require('./server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
  });
  afterEach(done => server.close(done));

  describe('sanity check', () => {
    it('should 404 to /', () => request(server)
      .get('/')
      .expect(404));

    it('should 404 to /some/random/path', () => request(server)
      .get('/some/random/path')
      .expect(404));
  });
});
