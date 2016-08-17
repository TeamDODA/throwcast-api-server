const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const Podcast = require('../podcast/podcast.model');
const Station = require('../station/station.model');
const User = require('../user/user.model');
const Playlist = require('./playlist.model');
const db = require('../../db');

describe('Playlists API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  let station1;
  let podcast1;
  let podcast2;
  let user1;
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
    .then(() => User.create({
      username: 'Testing1',
      password: 'Testing1',
      provider: 'local',
    }))
    .then(created => (user1 = created))
    .then(() => {
      const app = require('../../server', { bustCache: true });
      server = app.listen(app.get('port'), app.get('ip'));
    }));
  afterEach(() => cleanModels().then(() => server.close()));

  describe('Post /', () => {
    it('should create playlist', () => request(server)
      .post('/api/playlists/')
      .send({
        name: 'test',
        owner: user1._id,
        podcast: podcast1._id,
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body._id.should.exist));
  });

  describe('Get /', () => {
    beforeEach(() => Playlist
      .create({
        name: 'test',
        owner: user1._id,
        podcasts: [podcast1._id],
      }));

    it('Should send back list of playlist', () => request(server)
      .get('/api/playlists/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.data.length.should.equal(1)));
  });

  describe('Get specific playlist', () => {
    let playlist;
    beforeEach(() => Playlist
      .create({
        name: 'test',
        owner: user1._id,
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
        owner: user1._id,
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
        owner: user1._id,
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
        owner: user1._id,
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
