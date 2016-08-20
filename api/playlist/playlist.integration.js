const request = require('supertest-as-promised');

require('../../utils/testing');
const Podcast = require('../podcast/podcast.model');
const Station = require('../station/station.model');
const User = require('../user/user.model');
const Playlist = require('./playlist.model');

const provider = 'local';

describe('Playlists API', () => {
  let server;
  let station1;
  let podcast1;
  let podcast2;
  let token1;
  let token2;
  let user1;
  let user2;
  let agent;
  beforeEach(() => Station
    .create({
      title: 'station1',
      link: 'http://station1.com',
      description: 'fake station1',
    })
    .then(created => (station1 = created))
    .then(() => Podcast.create([{
      title: 'station1 podcast1',
      link: 'https://station1.com/podcast1',
      description: 'station1 podcast1',
      station: station1._id,
    }, {
      title: 'station2 podcast1',
      link: 'https://station2.com/podcast1',
      description: 'station2 podcast1',
      station: station1._id,
    }]))
    .then(created => ([podcast1, podcast2] = created))
    .then(() => User.create([{
      username: 'username1',
      password: 'password1',
      provider,
    }, {
      username: 'username2',
      password: 'password2',
      provider,
    }]))
    .then(created => ([user1, user2] = created))
    .then(() => {
      const app = require('../../server', { bustCache: true });
      server = app.listen(app.get('port'), app.get('ip'));
      return (agent = request(app));
    })
    .then(() => agent
      .post('/auth/local')
      .send({ username: 'username1', password: 'password1', provider })
      .then(res => (token1 = res.body.token)))
    .then(() => agent
      .post('/auth/local')
      .send({ username: 'username2', password: 'password2', provider })
      .then(res => (token2 = res.body.token))));
  afterEach(() => server.close());

  describe('/api/playlists', () => {
    describe('POST', () => {
      describe('requires user authentication', () => {
        it('should respond with 401 Not Authorized', () => agent
          .post('/api/playlists')
          .expect(401));
      });

      describe('with valid request', () => {
        it('should respond with 200 and created playlist', () => agent
          .post('/api/playlists/')
          .set('authorization', `Bearer ${token1}`)
          .send({ title: 'test', podcasts: [] })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            res.body.should.have.property('_id');
            res.body.should.have.property('title', 'test');
            res.body.should.have.property('podcasts');
          }));

        describe('with no podcasts', () => {
          it('should create playlist with empty podcasts array', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ title: 'test', podcasts: [] })
            .then(res => res.body.podcasts.should.have.length(0)));

          it('should create playlist with empty podcasts array', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ title: 'test' })
            .then(res => res.body.podcasts.should.have.length(0)));
        });

        describe('with podcasts', () => {
          it('should create playlist with podcasts array', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ title: 'test', podcasts: [podcast1._id] })
            .then(res => res.body.podcasts.should.have.length(1)));

          it('should create playlist with podcasts array', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ title: 'test', podcasts: [podcast1._id, podcast2._id] })
            .then(res => res.body.podcasts.should.have.length(2)));

          it('should populate the podcasts array', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ title: 'test', podcasts: [podcast1._id, podcast2._id] })
            .then(res => res.body.podcasts
              .map(podcast => podcast.should.have.property('title'))));
        });
      });

      describe('with invalid request', () => {
        describe('-- podcasts is not an array', () => {
          it('should respond with 500', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ title: 'test', podcasts: 'foo' })
            .expect(500)
            .then(() => Playlist.find({}).should.eventually.have.length(0)));
        });

        describe('-- podcasts has invalid podcastsIds in array', () => {
          it('should respond with 500', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ title: 'test', podcasts: ['foo'] })
            .expect(500)
            .then(() => Playlist.find({}).should.eventually.have.length(0)));
        });

        describe('-- title missing', () => {
          it('should respond with 500', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({})
            .expect(500)
            .then(() => Playlist.find({}).should.eventually.have.length(0)));
        });
      });
    });

    describe('GET', () => {
      beforeEach(() => Playlist
        .create({
          title: 'test playlist1',
          owner: user1._id,
          podcasts: [podcast1._id, podcast2._id],
        })
        .then(() => Playlist.create({
          title: 'test playlist2',
          owner: user2._id,
          podcasts: [podcast2._id],
        })));

      describe('requires user authentication', () => {
        it('should respond with 401 Not Authorized', () => agent
          .get('/api/playlists')
          .expect(401));
      });

      describe('with no query params', () => {
        it('should send back list of all playlist', () => agent
          .get('/api/playlists/')
          .set('authorization', `Bearer ${token1}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => res.body.length.should.equal(2)));

        it('should populate podcasts in the playlists', () => agent
          .get('/api/playlists/')
          .set('authorization', `Bearer ${token1}`)
          .then(res => res.body[0].podcasts.forEach(item => {
            item.should.have.property('_id');
            item.should.have.property('title');
            item.should.have.property('link');
            item.should.have.property('description');
            item.should.have.property('station');
          })));
      });
    });
  });

  describe('/api/playlists/:playlistId', () => {
    let playlist1;
    let playlist2;
    beforeEach(() => Playlist
      .create({
        title: 'test playlist1',
        owner: user1._id,
        podcasts: [podcast1._id, podcast2._id],
      })
      .then(created => (playlist1 = created))
      .then(() => Playlist.create({
        title: 'test playlist2',
        owner: user2._id,
        podcasts: [podcast2._id],
      }))
      .then(created => (playlist2 = created)));

    describe('GET', () => {
      describe('requires user authentication', () => {
        it('should respond with 401 Not Authorized', () => agent
          .get(`/api/playlists/${playlist1.id}`)
          .expect(401));
      });

      describe('for playlists owned by the user', () => {
        it('should respond 200 and send the playlist', () => agent
          .get(`/api/playlists/${playlist1.id}`)
          .set('authorization', `Bearer ${token1}`)
          .expect(200)
          .then(res => res.body._id.should.equal(playlist1.id)));
      });

      describe('for playlists not owned by the user', () => {
        it('should respond 200 and send the playlist', () => agent
          .get(`/api/playlists/${playlist2.id}`)
          .set('authorization', `Bearer ${token1}`)
          .expect(200)
          .then(res => res.body._id.should.equal(playlist2.id)));
      });
    });

    describe('DELETE', () => {
      describe('requires user authentication', () => {
        it('should respond with 401 Not Authorized', () => agent
          .delete(`/api/playlists/${playlist1.id}`)
          .expect(401));
      });

      describe('requires user to be owner of playlist', () => {
        it('should respond with 403 Forbidden', () => agent
          .delete(`/api/playlists/${playlist1.id}`)
          .set('authorization', `Bearer ${token2}`)
          .expect(403));
      });

      describe('for playlists owned by the user', () => {
        it('should delete the playlist', () => agent
          .delete(`/api/playlists/${playlist1.id}`)
          .set('authorization', `Bearer ${token1}`)
          .expect(204)
          .then(() => Playlist.findById(playlist1._id).should.eventually.be.null));

        it('should delete the playlist', () => agent
          .delete(`/api/playlists/${playlist2.id}`)
          .set('authorization', `Bearer ${token2}`)
          .expect(204)
          .then(() => Playlist.findById(playlist2._id).should.eventually.be.null));
      });
    });

    describe('PUT', () => {
      describe('requires user authentication', () => {
        it('should respond with 401 Not Authorized', () => agent
          .put(`/api/playlists/${playlist1.id}`)
          .expect(401));
      });

      describe('requires user to be owner of playlist', () => {
        it('should respond with 403 Forbidden', () => agent
          .put(`/api/playlists/${playlist1.id}`)
          .set('authorization', `Bearer ${token2}`)
          .expect(403));
      });

      describe('updatable fields', () => {
        describe('title', () => {
          it('should change the playlist title', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(), { title: 'new title' }))
            .expect(200)
            .then(res => res.body.title.should.equal('new title'))
            .then(() => Playlist.findById(playlist1.id)
              .should.eventually.have.property('title', 'new title')));

          it('should not update if title is invalid', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(), { title: '' }))
            .expect(500));

          it('should not update if title is invalid', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(), { title: null }))
            .expect(500));
        });

        describe('podcasts', () => {
          it('should be removed by updates', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(), { podcasts: [] }))
            .expect(200)
            .then(res => res.body.podcasts.should.have.length(0)));

          it('should be added by updates', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(),
              { podcasts: [podcast1.id, podcast1.id, podcast2.id] }))
            .expect(200)
            .then(res => res.body.podcasts.should.have.length(3)));

          it('should be reordered by updates', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(),
              { podcasts: [podcast2.id, podcast1.id] }))
            .expect(200)
            .then(res => {
              res.body.podcasts.should.have.length(2);
              res.body.podcasts[0].should.have.property('_id', podcast2.id);
              res.body.podcasts[1].should.have.property('_id', podcast1.id);
            }));
        });
      });

      describe('non updatable fields', () => {
        describe('_id', () => {
          it('should not be updated', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(), { _id: playlist1.id }))
            .expect(200)
            .then(res => res.body._id.should.be.equal(playlist1.id)));
        });

        describe('owner', () => {
          it('should not be updated', () => agent
            .put(`/api/playlists/${playlist1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .send(Object.assign(playlist1.toObject(), { owner: user2.id }))
            .expect(200)
            .then(res => res.body.owner.should.be.equal(user1.id)));
        });
      });
    });
  });
});
