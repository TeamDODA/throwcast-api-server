const request = require('supertest-as-promised');

require('../../utils/testing');
const User = require('../../api/user/user.model');

const userCredentials = [{
  username: 'username1',
  password: 'password1',
  provider: 'local',
}, {
  username: 'username2',
  password: 'password2',
  provider: 'local',
}, {
  username: 'username3',
  password: 'password3',
  provider: 'local',
}];

describe('Local auth', () => {
  let server;
  beforeEach(() => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
    return User.create(userCredentials.slice(0, 2));
  });
  afterEach(() => server.close());

  describe('POST /auth/local', () => {
    it('should send status 200 response with signed token', () => request(server)
      .post('/auth/local')
      .send(userCredentials[0])
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.should.have.property('token')));

    it('should send status 200 response with signed token', () => request(server)
      .post('/auth/local')
      .send(userCredentials[1])
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.should.have.property('token')));

    it('should send "Missing credential" message when no password', () => request(server)
      .post('/auth/local')
      .send({ username: 'username1' })
      .expect(401)
      .then(res => {
        res.body.should.not.have.property('token');
        res.body.should.have.property('message');
        res.body.message.should.equal('Missing credentials');
      }));

    it('should send "Missing credential" message when no username', () => request(server)
      .post('/auth/local')
      .send({ password: 'password1' })
      .expect(401)
      .then(res => {
        res.body.should.not.have.property('token');
        res.body.should.have.property('message');
        res.body.message.should.equal('Missing credentials');
      }));

    it('should send "Invalid username" message when no user with username', () => request(server)
      .post('/auth/local')
      .send({ username: 'nonExistentUsername', password: 'password' })
      .expect(401)
      .then(res => {
        res.body.should.not.have.property('token');
        res.body.should.have.property('message');
        res.body.message.should.equal('Invalid username');
      }));

    it('should send "Invalid password" message when password mismatches', () => request(server)
      .post('/auth/local')
      .send({ username: userCredentials[0].username, password: 'password' })
      .expect(401)
      .then(res => {
        res.body.should.not.have.property('token');
        res.body.should.have.property('message');
        res.body.message.should.equal('Invalid password');
      }));
  });
});
