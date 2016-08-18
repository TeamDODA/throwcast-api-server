const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const User = require('./user.model');
const Station = require('../station/station.model');
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

  describe('/api/users', () => {
    describe('POST', () => {
      describe('with valid credentials', () => {
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
      });

      describe('with invalid credentials', () => {
        describe('-- username in use', () => {
          beforeEach(() => request(server)
            .post('/api/users')
            .send(userCredentials[0])
            .expect(200));

          it('should send 422 status code', () => request(server)
            .post('/api/users')
            .send({ username: 'username1', password: 'somepassword' })
            .expect(422));

          it('should send User validation failed message', () => request(server)
            .post('/api/users')
            .send({ username: 'username1', password: 'somepassword' })
            .then(res => {
              res.body.should.not.have.property('token');
              res.body.should.have.property('message');
              res.body.message.should.equal('User validation failed');
            }));
        });

        describe('-- username missing', () => {
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

        describe('-- password missing', () => {
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
      });
    });
  });

  describe('/api/users/subscriptions', () => {
    describe('POST', () => {
      let station;
      let token;
      const { username, password } = userCredentials[0];
      beforeEach(() => User.create({ provider: 'local', username, password })
        .then(() => Station.create({
          title: 'station1',
          link: 'http://station1.com',
          description: 'test station1',
        }))
        .then(created => (station = created))
        .then(() => request(server)
          .post('/auth/local')
          .send({ username, password })
          .then(res => (token = res.body.token))));

      it('should start empty for a new user', () => request(server)
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .then(res => res.body.subscriptions.should.have.length(0)));

      it('should respond with 401 if not authenticated', () => request(server)
        .post('/api/users/subscriptions')
        .send({ stationId: station._id })
        .expect(401));

      describe('with a valid request', () => {
        it('should respond with 200 and the added station', () => request(server)
          .post('/api/users/subscriptions')
          .set('authorization', `Bearer ${token}`)
          .send({ stationId: station._id })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            res.body.should.have.property('title', station.title);
            res.body.should.have.property('_id', station.id);
          }));

        it('should add the station to subscriptions', () => request(server)
          .post('/api/users/subscriptions')
          .set('authorization', `Bearer ${token}`)
          .send({ stationId: station._id })
          .then(() => request(server)
            .get('/api/users/me')
            .set('authorization', `Bearer ${token}`)
            .then(res => res.body.subscriptions.should.have.length(1))));
      });

      describe('with an invalid request', () => {
        describe('-- missing stationId', () => {
          it('should respond with 500', () => request(server)
            .post('/api/users/subscriptions')
            .set('authorization', `Bearer ${token}`)
            .send({})
            .expect(500));

          it('should not add a station', () => request(server)
            .post('/api/users/subscriptions')
            .set('authorization', `Bearer ${token}`)
            .send({})
            .then(() => request(server)
              .get('/api/users/me')
              .set('authorization', `Bearer ${token}`)
              .then(res => res.body.subscriptions.should.have.length(0))));
        });

        describe('-- invalid stationId', () => {
          it('should respond with 500', () => request(server)
            .post('/api/users/subscriptions')
            .set('authorization', `Bearer ${token}`)
            .send({ stationId: 'foo' })
            .expect(500));

          it('should not add a station', () => request(server)
            .post('/api/users/subscriptions')
            .set('authorization', `Bearer ${token}`)
            .send({ stationId: 'foo' })
            .then(() => request(server)
              .get('/api/users/me')
              .set('authorization', `Bearer ${token}`)
              .then(res => res.body.subscriptions.should.have.length(0))));
        });
      });
    });

    describe('DELETE', () => {
      let station1;
      let station2;
      let token;
      let user;
      const { username, password } = userCredentials[0];
      beforeEach(() => Station
        .create({
          title: 'station1',
          link: 'http://station1.com',
          description: 'test station1',
        })
        .then(created => (station1 = created))
        .then(() => Station.create({
          title: 'station2',
          link: 'http://station2.com',
          description: 'test station2',
        }))
        .then(created => (station2 = created))
        .then(() => User.create({
          username,
          password,
          provider: 'local',
          subscriptions: [station1._id],
        }))
        .then(created => (user = created))
        .then(() => request(server)
          .post('/auth/local')
          .send({ username, password })
          .then(res => (token = res.body.token))));

      it('should have user with a single station subscribed', () => {
        user.subscriptions.should.have.length(1);
      });

      it('should respond with 401 if not authenticated', () => request(server)
        .delete(`/api/users/subscriptions/${station1.id}`)
        .expect(401));

      describe('with a subscribed station', () => {
        it('should respond with 202', () => request(server)
          .delete(`/api/users/subscriptions/${station1.id}`)
          .set('authorization', `Bearer ${token}`)
          .expect(202));

        it('should remove the station from subscriptions', () => request(server)
          .delete(`/api/users/subscriptions/${station1.id}`)
          .set('authorization', `Bearer ${token}`)
          .then(() => request(server)
            .get('/api/users/me')
            .set('authorization', `Bearer ${token}`)
            .then(res => res.body.subscriptions.should.have.length(0))));
      });

      describe('with a stationId not in user subscriptions', () => {
        it('should respond with 202', () => request(server)
          .delete(`/api/users/subscriptions/${station2.id}`)
          .set('authorization', `Bearer ${token}`)
          .expect(202));

        it('should not modify subscriptions', () => request(server)
          .delete(`/api/users/subscriptions/${station2.id}`)
          .set('authorization', `Bearer ${token}`)
          .then(() => request(server)
            .get('/api/users/me')
            .set('authorization', `Bearer ${token}`)
            .then(res => res.body.subscriptions.should.have.length(1))));
      });

      describe('with an invalid stationId', () => {
        it('should respond with 500', () => request(server)
          .delete('/api/users/subscriptions/foo')
          .set('authorization', `Bearer ${token}`)
          .expect(500));

        it('should not modify subscriptions', () => request(server)
          .delete('/api/users/subscriptions/foo')
          .set('authorization', `Bearer ${token}`)
          .then(() => request(server)
            .get('/api/users/me')
            .set('authorization', `Bearer ${token}`)
            .then(res => res.body.subscriptions.should.have.length(1))));
      });
    });
  });

  describe('/api/users/me', () => {
    let user;
    let token;
    const { username, password } = userCredentials[0];
    beforeEach(() => User.create({ provider: 'local', username, password })
      .then(created => (user = created))
      .then(() => request(server)
        .post('/auth/local')
        .send({ username, password })
        .then(res => (token = res.body.token))));

    describe('GET', () => {
      describe('when valid authorization token is sent', () => {
        it('should respond 200 status code and user info', () => request(server)
          .get('/api/users/me')
          .set('authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            res.body._id.toString().should.equal(user._id.toString());
            res.body.username.should.equal(user.username);
          }));
      });

      describe('when authorization token is missing', () => {
        it('should send 401 status code', () => request(server)
          .get('/api/users/me')
          .expect(401));
      });

      describe('when authorization token is invalid', () => {
        it('should send 401 status code', () => request(server)
          .get('/api/users/me')
          .set('authorization', 'Bearer some-invalid-token')
          .expect(401));
      });
    });
  });
});
