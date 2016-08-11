const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const User = require('../../api/user/user.model');
const db = require('../../db');

const userCredentials = [{
  username: 'username1',
  password: 'password1',
}, {
  username: 'username2',
  password: 'password2',
}, {
  username: 'username3',
  password: 'password3',
}];

describe('Local auth', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  beforeEach(() => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
    return User.create(userCredentials.slice(0, 2));
  });
  afterEach(() => cleanModels().then(() => server.close()));

  describe('POST /auth/local/sign-in', () => {
    it('should send status 200 response with signed token', () => request(server)
      .post('/auth/local/sign-in')
      .send(userCredentials[0])
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.should.have.property('token')));

    it('should send status 200 response with signed token', () => request(server)
      .post('/auth/local/sign-in')
      .send(userCredentials[1])
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.should.have.property('token')));

    it('should send "invalid login" statusMessage when no user with username', () => request(server)
      .post('/auth/local/sign-in')
      .send({ username: 'nonExistentUsername' })
      .expect(200)
      .then(res => {
        res.body.should.not.have.property('token');
        res.body.should.have.property('statusMessage');
        res.body.statusMessage.should.equal('invalid login');
      }));

    it('should send "invalid login" statusMessage when password mismatches', () => request(server)
      .post('/auth/local/sign-in')
      .send({ username: userCredentials[0].username, password: 'password' })
      .expect(200)
      .then(res => {
        res.body.should.not.have.property('token');
        res.body.should.have.property('statusMessage');
        res.body.statusMessage.should.equal('invalid login');
      }));
  });

  describe('POST /auth/local/sign-up', () => {
    it('should create a new user with username and password', () => request(server)
      .post('/auth/local/sign-up')
      .send(userCredentials[2])
      .expect(200)
      .then(() => User.find({ username: userCredentials[2].username }))
      .then(foundUser => foundUser.should.exist));

    it('should send status 200 response with signed token', () => request(server)
      .post('/auth/local/sign-up')
      .send(userCredentials[2])
      .expect(200)
      .then(res => res.body.should.have.property('token')));

    it('should be able to sign in with created user', () => request(server)
      .post('/auth/local/sign-up')
      .send(userCredentials[2])
      .expect(200)
      .then(() => request(server)
        .post('/auth/local/sign-in')
        .send(userCredentials[2])
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => res.body.should.have.property('token'))));

    it('should send "username exists" statusMessage when username exists', () => request(server)
      .post('/auth/local/sign-up')
      .send(userCredentials[0])
      .expect(200)
      .then(res => {
        res.body.should.not.have.property('token');
        res.body.should.have.property('statusMessage');
        res.body.statusMessage.should.equal('username exists');
      }));
  });
});
