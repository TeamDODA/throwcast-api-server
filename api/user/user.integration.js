const request = require('supertest-as-promised');

require('../../utils/testing');
const User = require('./user.model');

const userCredentials = [{
  username: 'username1',
  password: 'password1',
}, {
  username: 'username2',
  password: 'password2',
}];

describe('User API', () => {
  let server;
  let agent;
  beforeEach(done => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
    agent = request(server);
    done();
  });
  afterEach(() => server.close());

  describe('/api/users', () => {
    describe('POST', () => {
      describe('with valid credentials', () => {
        it('should create a new user with username and password', () => agent
          .post('/api/users')
          .send(userCredentials[0])
          .expect(200)
          .then(() => User.find({ username: userCredentials[0].username }))
          .then(foundUser => foundUser.should.exist));

        it('should send status 200 response with signed token', () => agent
          .post('/api/users')
          .send(userCredentials[0])
          .expect(200)
          .then(res => res.body.should.have.property('token')));

        it('should be able to sign in with created user', () => agent
          .post('/api/users')
          .send(userCredentials[1])
          .expect(200)
          .then(() => agent
            .post('/auth/local')
            .send(userCredentials[1])
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => res.body.should.have.property('token'))));
      });

      describe('with invalid credentials', () => {
        describe('-- username in use', () => {
          beforeEach(() => agent
            .post('/api/users')
            .send(userCredentials[0])
            .expect(200));

          it('should send 422 status code', () => agent
            .post('/api/users')
            .send({ username: 'username1', password: 'somepassword' })
            .expect(422));

          it('should send User validation failed message', () => agent
            .post('/api/users')
            .send({ username: 'username1', password: 'somepassword' })
            .then(res => {
              res.body.should.not.have.property('token');
              res.body.should.have.property('message');
              res.body.message.should.equal('User validation failed');
            }));
        });

        describe('-- username missing', () => {
          it('should send 422 status code', () => agent
            .post('/api/users')
            .send({ password: 'password' })
            .expect(422));

          it('should send User validation failed message', () => agent
            .post('/api/users')
            .send({ password: 'password' })
            .then(res => {
              res.body.should.not.have.property('token');
              res.body.should.have.property('message');
              res.body.message.should.equal('User validation failed');
            }));
        });

        describe('-- password missing', () => {
          it('should send 422 status code', () => agent
            .post('/api/users')
            .send({ username: 'username3' })
            .expect(422));

          it('should send User validation failed message', () => agent
            .post('/api/users')
            .send({ username: 'username3' })
            .then(res => {
              res.body.should.not.have.property('token');
              res.body.should.have.property('message');
              res.body.message.should.equal('User validation failed');
            }));
        });
      });
    });
  });

  describe('/api/users/me', () => {
    let user;
    let token;
    const { username, password } = userCredentials[0];
    beforeEach(() => User.create({ provider: 'local', username, password })
      .then(created => (user = created))
      .then(() => agent
        .post('/auth/local')
        .send({ username, password })
        .then(res => (token = res.body.token))));

    describe('GET', () => {
      describe('requires user authentication', () => {
        describe('with invalid authorization token', () => {
          it('should respond with 401 Not Authorized', () => agent
            .get('/api/users/me')
            .expect(401));
        });

        describe('-- authorization token invalid', () => {
          it('should send 401 status code', () => agent
            .get('/api/users/me')
            .set('authorization', 'Bearer some-invalid-token')
            .expect(401));
        });
      });

      describe('with valid authorization token', () => {
        it('should respond 200 status code and user info', () => agent
          .get('/api/users/me')
          .set('authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            res.body._id.should.equal(user.id);
            res.body.username.should.equal(user.username);
            res.body.should.have.property('subscriptions');
          }));
      });
    });
  });
});
