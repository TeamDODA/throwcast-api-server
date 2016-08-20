const request = require('supertest-as-promised');

const tu = require('../../../utils/testing');

describe('User#subscription API', () => {
  let agent;
  let server;
  let stations;
  let tokens;
  let users;
  beforeEach(() => tu.createStations(3)
    .then(created => (stations = created))
    .then(() => tu.createUsers(2))
    .then(created => (users = created))
    .then(() => {
      delete require.cache[require.resolve('../../../server')];
      const app = require('../../../server');

      server = app.listen(app.get('port'), app.get('ip'));
      return (agent = request(app));
    })
    .then(() => tu.tokensForUsers(users, agent))
    .then(created => (tokens = created)));
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
            .set('authorization', `Bearer ${tokens[0]}`)
            .send([stations[0]._id, stations[1]._id, stations[2]._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(tu.entitiesToIds)
            .should.eventually.eql([stations[0].id, stations[1].id, stations[2].id]));
        });

        describe('to unsubscribe to a station', () => {
          it('should update subscriptions', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .send([stations[1]._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(tu.entitiesToIds)
            .should.eventually.eql([stations[1].id]));
        });

        describe('to reorder subscriptions', () => {
          it('should update subscriptions', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .send([stations[2]._id, stations[1]._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(tu.entitiesToIds)
            .should.eventually.eql([stations[2].id, stations[1].id]));
        });

        describe('to subscribe and unsubscribe to a station', () => {
          it('should update subscriptions', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .send([stations[0]._id, stations[2]._id])
            .expect(200)
            .should.eventually.have.property('body')
            .and.have.property('subscriptions')
            .then(tu.entitiesToIds)
            .should.eventually.eql([stations[0].id, stations[2].id]));
        });
      });

      describe('with invalid request', () => {
        describe('-- no req.body', () => {
          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .expect(500));
        });

        describe('-- req.body not an array', () => {
          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .send({})
            .expect(500));
        });

        describe('-- req.body.subscription contains invalid ids', () => {
          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .send(['foo'])
            .expect(500));

          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .send([stations[0].id, null])
            .expect(500));

          it('should respond with 500', () => agent
            .put('/api/users/subscriptions')
            .set('authorization', `Bearer ${tokens[1]}`)
            .send([stations[0].id, 'foo'])
            .expect(500));
        });
      });
    });
  });
});
