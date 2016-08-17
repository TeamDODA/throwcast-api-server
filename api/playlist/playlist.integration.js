const request = require('supertest-as-promised');

const { cleanModels } = require('../../utils/testing');
const Podcast = require('../podcast/podcast.model');
const Station = require('../station/station.model');
const User = require('../user/user.model');
const Playlist = require('./playlist.model');
const db = require('../../db');

const station = {
  title: 'station1',
  link: 'http://station1.com',
  description: 'fake station1',
};

const podcasts = [{
  title: 'station1 podcast1',
  link: 'http://station1.com/podcast1',
  description: 'station1 podcast1',
}, {
  title: 'station2 podcast1',
  link: 'http://station2.com/podcast1',
  description: 'station2 podcast1',
}];

const user = {
  username: 'Testing1',
  password: 'Testing1',
  provider: 'local',
};

const playlist = {
  name: 'test',
  owner: null,
  podcast: null,
};

describe('Playlists API', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let server;
  beforeEach(() => {
    const app = require('../../server', { bustCache: true });
    server = app.listen(app.get('port'), app.get('ip'));
    return Station.create(station)
      .then(createdStation => {
        podcasts[0].station = createdStation._id;
        podcasts[1].station = createdStation._id;
      })
      .then(() => Podcast.create(podcasts))
      .then(createdPodcasts => {
        playlist.podcast = createdPodcasts[0]._id;
        podcasts[0]._id = createdPodcasts[0]._id;
        podcasts[1]._id = createdPodcasts[1]._id;
      })
      .then(() => User.create(user))
      .then(createdUser => (playlist.owner = createdUser._id));
  });

  afterEach(() => cleanModels().then(() => server.close()));

  describe('Post /', () => {
    it('should create playlist', () => request(server)
      .post('/api/playlists/')
      .send(playlist)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body._id.should.exist));
  });

  describe('Get /', () => {
    beforeEach(() => request(server)
      .post('/api/playlists/')
      .send(playlist)
      .expect(200));

    it('Should send back list of playlist', () => request(server)
      .get('/api/playlists/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => res.body.data.length.should.equal(1)));
  });

  describe('Get specific playlist', () => {
    let playlistId;
    beforeEach(() => request(server)
      .post('/api/playlists/')
      .send(playlist)
      .expect(200)
      .then(res => (playlistId = res.body._id)));

    it('Should send back the requested playlist', () => request(server)
      .get(`/api/playlists/${playlistId}`)
      .expect(200)
      .then(res => res.body.data._id.should.equal(playlistId)));
  });

  describe('Delete playlist', () => {
    let playlistId;
    beforeEach(() => request(server)
      .post('/api/playlists/')
      .send(playlist)
      .expect(200)
      .then(res => (playlistId = res.body._id)));

    it('Should delete the requested playlist', () => request(server)
      .delete(`/api/playlists/${playlistId}`)
      .expect(202)
      .then(() => Playlist.find({}).exec())
      .then(playlists => playlists.length.should.equal(0)));
  });

  describe('Add to playlist', () => {
    let playlistId;
    beforeEach(() => request(server)
      .post('/api/playlists/')
      .send(playlist)
      .expect(200)
      .then(res => (playlistId = res.body._id)));

    it('Should add podcast to playlist', () => request(server)
      .post(`/api/playlists/${playlistId}/podcasts/`)
      .send({ podcastId: podcasts[1]._id })
      .expect(200)
      .then(() => Playlist.find({}).exec())
      .then(list => list[0].podcasts[1].should.deep.equal(podcasts[1]._id)));
  });

  describe('Delete from playlist', () => {
    let playlistId;
    beforeEach(() => request(server)
      .post('/api/playlists/')
      .send(playlist)
      .expect(200)
      .then(res => (playlistId = res.body._id)));

    it('Should delete podcast to playlist', () => request(server)
      .delete(`/api/playlists/${playlistId}/podcasts/${podcasts[0]._id}`)
      .expect(202)
      .then(() => Playlist.find({}).exec())
      .then(list => list[0].podcasts.length.should.equal(0)));
  });
});
