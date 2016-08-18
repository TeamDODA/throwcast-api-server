const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const Podcast = require('../podcast/podcast.model');
const Station = require('../station/station.model');
const User = require('../user/user.model');
const Playlist = require('./playlist.model');
const db = require('../../db');

const provider = 'local';

describe('Playlists API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

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
    .then(() => Podcast.create({
      title: 'station1 podcast1',
      link: 'https://station1.com/podcast1',
      description: 'station1 podcast1',
      station: station1._id,
    }))
    .then(created => (podcast1 = created))
    .then(() => Podcast.create({
      title: 'station2 podcast1',
      link: 'https://station2.com/podcast1',
      description: 'station2 podcast1',
      station: station1._id,
    }))
    .then(created => (podcast2 = created))
    .then(() => User.create({ username: 'username1', password: 'password1', provider }))
    .then(created => (user1 = created))
    .then(() => User.create({ username: 'username2', password: 'password2', provider }))
    .then(created => (user2 = created))
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
  afterEach(() => cleanModels().then(() => server.close()));

  describe('/api/playlists', () => {
    describe('POST', () => {
      it('should respond with 401 Not Authorized', () => agent
        .post('/api/playlists')
        .expect(401));

      describe('with a podcast', () => {
        it('should create playlist with the podcast in podcasts', () => agent
          .post('/api/playlists/')
          .set('authorization', `Bearer ${token1}`)
          .send({ name: 'test', podcast: podcast1._id })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            res.body.should.have.property('_id');
            res.body.should.have.property('name', 'test');
            res.body.should.have.property('podcasts');
            res.body.podcasts.should.have.length(1);
          }));
      });

      describe('with no podcast', () => {
        it('should create playlist with an empty podcasts array', () => agent
          .post('/api/playlists/')
          .set('authorization', `Bearer ${token1}`)
          .send({ name: 'test' })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            res.body.should.have.property('_id');
            res.body.should.have.property('name', 'test');
            res.body.should.have.property('podcasts');
            res.body.podcasts.should.have.length(0);
          }));
      });

      describe('with invalid request', () => {
        describe('-- podcastId is not an objectId', () => {
          it('should respond with 500', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({ name: 'test', podcast: 'foo' })
            .expect(500));
        });

        describe('-- name missing', () => {
          it('should respond with 500', () => agent
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token1}`)
            .send({})
            .expect(500));
        });
      });
    });

    describe('GET', () => {
      beforeEach(() => Playlist
        .create({
          name: 'test playlist1',
          owner: user1._id,
          podcasts: [podcast1._id, podcast2._id],
        })
        .then(() => Playlist.create({
          name: 'test playlist2',
          owner: user2._id,
          podcasts: [podcast2._id],
        })));

      it('should respond with 401 Not Authorized', () => agent
        .get('/api/playlists')
        .expect(401));

      it('should send back list of all playlist', () => agent
        .get('/api/playlists/')
        .set('authorization', `Bearer ${token1}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => res.body.data.length.should.equal(2)));

      it('should populate podcasts in the playlists', () => agent
        .get('/api/playlists/')
        .set('authorization', `Bearer ${token1}`)
        .then(res => res.body.data[0].podcasts.forEach(item => {
          item.should.have.property('_id');
          item.should.have.property('title');
          item.should.have.property('link');
          item.should.have.property('description');
          item.should.have.property('station');
        })));
    });
  });

  describe('/api/playlists/:playlistId', () => {
    let playlist1;
    let playlist2;
    beforeEach(() => Playlist
      .create({
        name: 'test playlist1',
        owner: user1._id,
        podcasts: [podcast1._id, podcast2._id],
      })
      .then(created => (playlist1 = created))
      .then(() => Playlist.create({
        name: 'test playlist2',
        owner: user2._id,
        podcasts: [podcast2._id],
      }))
      .then(created => (playlist2 = created)));

    describe('GET', () => {
      it('should respond with 401 Not Authorized', () => agent
        .get(`/api/playlists/${playlist1.id}`)
        .expect(401));

      it('should send back the requested playlist', () => agent
        .get(`/api/playlists/${playlist1.id}`)
        .set('authorization', `Bearer ${token1}`)
        .expect(200)
        .then(res => res.body._id.should.equal(playlist1.id)));

      it('should send back the requested playlist', () => agent
        .get(`/api/playlists/${playlist2.id}`)
        .set('authorization', `Bearer ${token1}`)
        .expect(200)
        .then(res => res.body._id.should.equal(playlist2.id)));
    });

    describe('DELETE', () => {
      it('should respond with 401 Not Authorized', () => agent
        .delete(`/api/playlists/${playlist1.id}`)
        .expect(401));

      describe('when the user is the owner of the playlist', () => {
        it('should delete the requested playlist', () => agent
          .delete(`/api/playlists/${playlist1.id}`)
          .set('authorization', `Bearer ${token1}`)
          .expect(202)
          .then(() => Playlist.findById(playlist1._id).should.eventually.be.null));

        it('should delete the requested playlist', () => agent
          .delete(`/api/playlists/${playlist2.id}`)
          .set('authorization', `Bearer ${token2}`)
          .expect(202)
          .then(() => Playlist.findById(playlist2._id).should.eventually.be.null));
      });

      describe('when the user is not the owner of the playlist', () => {
        it('should respond with 403 Forbidden', () => agent
          .delete(`/api/playlists/${playlist1.id}`)
          .set('authorization', `Bearer ${token2}`)
          .expect(403));

        it('should respond with 403 Forbidden', () => agent
          .delete(`/api/playlists/${playlist2.id}`)
          .set('authorization', `Bearer ${token1}`)
          .expect(403));
      });
    });
  });

  describe('/api/playlists/:playlistId/podcasts', () => {
    let playlist1;
    beforeEach(() => Playlist
      .create({
        name: 'test playlist1',
        owner: user1._id,
        podcasts: [podcast1._id],
      })
      .then(created => (playlist1 = created)));

    describe('POST', () => {
      it('should respond with 401 Not Authorized', () => agent
        .post(`/api/playlists/${playlist1.id}/podcasts/`)
        .expect(401));

      describe('when uri is invalid', () => {
        describe('-- playlist does not exist', () => {
          it('should respond with 404 Not Found', () => agent
            .post(`/api/playlists/${user1.id}/podcasts/`)
            .set('authorization', `Bearer ${token1}`)
            .expect(404));
        });

        describe('-- playlistId is not an objectId', () => {
          it('should respond with 500', () => agent
            .post('/api/playlists/foo/podcasts/')
            .set('authorization', `Bearer ${token1}`)
            .expect(500));
        });
      });

      describe('when the user is the owner of the playlist', () => {
        it('should add podcast to playlist', () => agent
          .post(`/api/playlists/${playlist1.id}/podcasts/`)
          .set('authorization', `Bearer ${token1}`)
          .send({ podcastId: podcast2._id })
          .expect(200)
          .then(() => Playlist.findById(playlist1._id).exec())
          .then(found => {
            found.podcasts[0].should.deep.equal(podcast1._id);
            found.podcasts[1].should.deep.equal(podcast2._id);
          }));

        describe('and the request body is invalid', () => {
          describe('-- podcast does not exist', () => {
            it('should respond with 404 Not Found', () => agent
              .post(`/api/playlists/${playlist1.id}/podcasts/`)
              .set('authorization', `Bearer ${token1}`)
              .send({ podcastId: user1._id })
              .expect(404));
          });

          describe('-- podcastId is not an objectId', () => {
            it('should respond with 500', () => agent
              .post(`/api/playlists/${playlist1.id}/podcasts/`)
              .set('authorization', `Bearer ${token1}`)
              .send({ podcastId: 'foo' })
              .expect(500));
          });
        });
      });

      describe('when the user is not the owner of the playlist', () => {
        it('should respond with 403 Forbidden', () => agent
          .post(`/api/playlists/${playlist1.id}/podcasts/`)
          .set('authorization', `Bearer ${token2}`)
          .send({ podcastId: podcast2._id })
          .expect(403));
      });

      describe('when the podcast is already in the playlist', () => {
        it('should respond with 400 Bad Request', () => agent
          .post(`/api/playlists/${playlist1.id}/podcasts/`)
          .set('authorization', `Bearer ${token1}`)
          .send({ podcastId: podcast1._id })
          .expect(400));
      });
    });
  });

  describe('/api/playlists/:playlistId/podcasts/:podcastId', () => {
    let playlist1;
    beforeEach(() => Playlist
      .create({
        name: 'test playlist1',
        owner: user1._id,
        podcasts: [podcast1._id],
      })
      .then(created => (playlist1 = created)));

    describe('DELETE', () => {
      it('should respond with 401 Not Authorized', () => agent
        .delete(`/api/playlists/${playlist1.id}/podcasts/${podcast1.id}`)
        .expect(401));

      describe('when uri is invalid', () => {
        describe('-- playlist does not exist', () => {
          it('should respond with 404 Not Found', () => agent
            .delete(`/api/playlists/${user1.id}/podcasts/${podcast1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .expect(404));
        });

        describe('-- playlistId is not an objectId', () => {
          it('should respond with 500', () => agent
            .delete(`/api/playlists/foo/podcasts/${podcast1.id}`)
            .set('authorization', `Bearer ${token1}`)
            .expect(500));
        });
      });

      describe('when the user is the owner of the playlist', () => {
        it('should respond 202 and delete podcast from playlist', () => agent
          .delete(`/api/playlists/${playlist1.id}/podcasts/${podcast1.id}`)
          .set('authorization', `Bearer ${token1}`)
          .expect(202)
          .then(() => Playlist.findById(playlist1._id)
            .should.eventually.have.property('podcasts')
            .and.have.length(0)));

        describe('and the uri is invalid', () => {
          describe('-- podcast does not exist', () => {
            it('should respond with 404 Not Found', () => agent
              .delete(`/api/playlists/${playlist1.id}/podcasts/${podcast2.id}`)
              .set('authorization', `Bearer ${token1}`)
              .expect(404));
          });

          describe('-- podcastId is not an objectId', () => {
            it('should respond with 404 Not Found', () => agent
              .delete(`/api/playlists/${playlist1.id}/podcasts/foo`)
              .set('authorization', `Bearer ${token1}`)
              .expect(400));
          });
        });
      });

      describe('when the user is not the owner of the playlist', () => {
        it('should respond with 403 Forbidden', () => agent
          .delete(`/api/playlists/${playlist1.id}/podcasts/${podcast1.id}`)
          .set('authorization', `Bearer ${token2}`)
          .expect(403));
      });
    });
  });
});
