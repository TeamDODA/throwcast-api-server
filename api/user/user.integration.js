const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const User = require('./user.model');
const db = require('../../db');

const userCredentials = [{
  username: 'username1',
  password: 'password1',
}, {
  username: 'username2',
  password: 'password2',
}];

describe('User API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  beforeEach(done => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
    done();
  });
  afterEach(() => cleanModels().then(() => server.close()));

  describe('POST /api/users', () => {
    it('should create a new user with username and password', () => request(server)
      .post('/api/users')
      .send(userCredentials[0])
      .expect(200)
      .then(() => User.find({ username: userCredentials[0].username }))
      .then(foundUser => foundUser.should.exist));

    it('should send status 200 response with signed token', () => request(server)
      .post('/api/users')
      .send(userCredentials[0])
      .expect(200)
      .then(res => res.body.should.have.property('token')));

    it('should be able to sign in with created user', () => request(server)
      .post('/api/users')
      .send(userCredentials[1])
      .expect(200)
      .then(() => request(server)
        .post('/auth/local')
        .send(userCredentials[1])
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => res.body.should.have.property('token'))));

    describe('with missing username', () => {
      it('should send 422 status code', () => request(server)
        .post('/api/users')
        .send({ password: 'password' })
        .expect(422));

      it('should send User validation failed message', () => request(server)
        .post('/api/users')
        .send({ password: 'password' })
        .then(res => {
          res.body.should.not.have.property('token');
          res.body.should.have.property('message');
          res.body.message.should.equal('User validation failed');
        }));
    });

    describe('with missing password', () => {
      it('should send 422 status code', () => request(server)
        .post('/api/users')
        .send({ username: 'username3' })
        .expect(422));

      it('should send User validation failed message', () => request(server)
        .post('/api/users')
        .send({ username: 'username3' })
        .then(res => {
          res.body.should.not.have.property('token');
          res.body.should.have.property('message');
          res.body.message.should.equal('User validation failed');
        }));
    });

    describe('with username that is already in use', () => {
      beforeEach(() => request(server)
          .post('/api/users')
          .send(userCredentials[0])
          .expect(200));

      it('should send 422 status code', () => request(server)
        .post('/api/users')
        .send({ username: 'username1', password: 'somepassword' })
        .expect(422));

      it('should send code 11000', () => request(server)
        .post('/api/users')
        .send({ username: 'username1', password: 'somepassword' })
        .then(res => {
          res.body.should.not.have.property('token');
          res.body.should.have.property('message');
          res.body.message.should.equal('Username already in use');
        }));
    });
  });
});
