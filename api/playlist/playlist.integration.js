const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const Podcast = require('../podcast/podcast.model');
const Station = require('../station/station.model');
const User = require('../user/user.model');
const Playlist = require('./playlist.model');
const db = require('../../db');

const username = 'username';
const password = 'password';
const provider = 'local';

describe('Playlists API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  let station1;
  let podcast1;
  let podcast2;
  let token;
  let user;
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
    .then(() => User.create({ username, password, provider }))
    .then(created => (user = created))
    .then(() => {
      const app = require('../../server', { bustCache: true });
      server = app.listen(app.get('port'), app.get('ip'));
    })
    .then(() => request(server)
      .post('/auth/local')
      .send({ username, password })
      .then(res => (token = res.body.token))));
  afterEach(() => cleanModels().then(() => server.close()));

  describe('/api/playlists/', () => {
    describe('POST', () => {
      it('should respond with 401 if not authenticated', () => request(server)
        .post('/api/playlists')
        .expect(401));

      describe('with a podcast', () => {
        it('should create playlist with the podcast in podcasts', () => request(server)
          .post('/api/playlists/')
          .set('authorization', `Bearer ${token}`)
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
        it('should create playlist with an empty podcasts field', () => request(server)
          .post('/api/playlists/')
          .set('authorization', `Bearer ${token}`)
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
        describe('-- invalid podcastId', () => {
          it('should respond with 500', () => request(server)
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token}`)
            .send({ name: 'test', podcast: 'foo' })
            .expect(500));
        });

        describe('-- name missing', () => {
          it('should respond with 500', () => request(server)
            .post('/api/playlists/')
            .set('authorization', `Bearer ${token}`)
            .send({})
            .expect(500));
        });
      });
    });

    describe('GET', () => {
      beforeEach(() => Playlist
        .create({
          name: 'test',
          owner: user._id,
          podcasts: [podcast1._id],
        }));

      it('should respond with 401 if not authenticated', () => request(server)
        .get('/api/playlists')
        .expect(401));

      it('should send back list of all playlist', () => request(server)
        .get('/api/playlists/')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => res.body.data.length.should.equal(1)));

      it('should populate podcasts in the playlists', () => request(server)
        .get('/api/playlists/')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          res.body.data[0].podcasts.forEach(item => {
            item.should.have.property('_id');
            item.should.have.property('title');
            item.should.have.property('link');
            item.should.have.property('description');
            item.should.have.property('station');
          });
        }));
    });
  });

  describe('Get specific playlist', () => {
    let playlist;
    beforeEach(() => Playlist
      .create({
        name: 'test',
        owner: user._id,
        podcasts: [podcast1._id],
      })
      .then(createdPlaylist => (playlist = createdPlaylist)));

    it('Should send back the requested playlist', () => request(server)
      .get(`/api/playlists/${playlist.id}`)
      .expect(200)
      .then(res => res.body.data._id.should.equal(playlist.id)));
  });

  describe('Delete playlist', () => {
    let playlist;
    beforeEach(() => Playlist
      .create({
        name: 'test',
        owner: user._id,
        podcasts: [podcast1._id],
      })
      .then(createdPlaylist => (playlist = createdPlaylist)));

    it('Should delete the requested playlist', () => request(server)
      .delete(`/api/playlists/${playlist.id}`)
      .expect(202)
      .then(() => Playlist.find({}).exec())
      .then(playlists => playlists.length.should.equal(0)));
  });

  describe('Add to playlist', () => {
    let playlist;
    beforeEach(() => Playlist
      .create({
        name: 'test',
        owner: user._id,
        podcasts: [podcast1._id],
      })
      .then(createdPlaylist => (playlist = createdPlaylist)));

    it('Should add podcast to playlist', () => request(server)
      .post(`/api/playlists/${playlist.id}/podcasts/`)
      .send({ podcastId: podcast2._id })
      .expect(200)
      .then(() => Playlist.findById(playlist.id).exec())
      .then(found => {
        found.podcasts[0].should.deep.equal(podcast1._id);
        found.podcasts[1].should.deep.equal(podcast2._id);
      }));
  });

  describe('Delete from playlist', () => {
    let playlist;
    beforeEach(() => Playlist
      .create({
        name: 'test',
        owner: user._id,
        podcasts: [podcast1._id],
      })
      .then(createdPlaylist => (playlist = createdPlaylist)));

    it('Should delete podcast to playlist', () => request(server)
      .delete(`/api/playlists/${playlist.id}/podcasts/${podcast1._id}`)
      .expect(202)
      .then(() => Playlist.find({}).exec())
      .then(list => list[0].podcasts.length.should.equal(0)));
  });
});
