const request = require('supertest-as-promised');

const { entitiesToIds } = require('../../../utils/testing');
const User = require('../user.model');
const Station = require('../../station/station.model');

const provider = 'local';

describe('User#subscription API', () => {
  let server;
  let agent;
  let station1;
  let station2;
  let station3;
  let token1;
  let token2;
  beforeEach(() => Station
    .create([{
      title: 'station1',
      link: 'http://station1.com',
      description: 'fake station1',
    }, {
      title: 'station2',
      link: 'http://station2.com',
      description: 'fake station2',
    }, {
      title: 'station3',
      link: 'http://station3.com',
      description: 'fake station3',
    }])
    .then(created => ([station1, station2, station3] = created))
    .then(() => User
      .create([{
        username: 'username1',
        password: 'password1',
        provider,
      }, {
        username: 'username2',
        password: 'password2',
        provider,
        subscriptions: [station2._id, station3._id],
      }]))
    .then(() => {
      const app = require('../../../server', { bustCache: true });
      server = app.listen(app.get('port'), app.get('ip'));
      return (agent = request(app));
    })
    .then(() => agent
      .post('/auth/local')
      .send({ username: 'username1', password: 'password1' })
      .then(res => (token1 = res.body.token)))
    .then(() => agent
      .post('/auth/local')
      .send({ username: 'username2', password: 'password2' })
      .then(res => (token2 = res.body.token))));
  afterEach(() => server.close());

  describe('/api/users/subscriptions', () => {
    describe('PUT', () => {
      describe('requires user authentication', () => {
        it('should respond with 401 Not Authorized', () => agent
          .put('/api/users/subscriptions')
          .expect(401));
      });

      describe('with valid request', () => {
        describe('to subscribe to a station', () => {
          it('should update subscriptions', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token1}`)
            .send([station1._id, station2._id, station3._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(entitiesToIds)
            .should.eventually.eql([station1.id, station2.id, station3.id]));
        });

        describe('to unsubscribe to a station', () => {
          it('should update subscriptions', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .send([station2._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(entitiesToIds)
            .should.eventually.eql([station2.id]));
        });

        describe('to reorder subscriptions', () => {
          it('should update subscriptions', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .send([station3._id, station2._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(entitiesToIds)
            .should.eventually.eql([station3.id, station2.id]));
        });

        describe('to subscribe and unsubscribe to a station', () => {
          it('should update subscriptions', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .send([station1._id, station3._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(entitiesToIds)
            .should.eventually.eql([station1.id, station3.id]));
        });
      });

      describe('with invalid request', () => {
        describe('-- no req.body', () => {
          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .expect(500));
        });

        describe('-- req.body not an array', () => {
          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .send({})
            .expect(500));
        });

        describe('-- req.body.subscription contains invalid ids', () => {
          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .send(['foo'])
            .expect(500));

          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .send([station1.id, null])
            .expect(500));

          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${token2}`)
            .send([station1.id, 'foo'])
            .expect(500));
        });
      });
    });
  });
});
