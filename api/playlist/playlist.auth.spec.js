const proxyquire = require('proxyquire');
const { mockReq, mockRes } = require('sinon-express-mock');

require('../../utils/testing');
const Playlist = require('../playlist/playlist.model');
const Podcast = require('../podcast/podcast.model');
const Station = require('../station/station.model');
const User = require('../user/user.model');

describe('Playlist Auth', () => {
  let controller;
  let errorSpy;
  let handleError;
  let playlist;
  let podcast;
  let user;
  beforeEach(() => User
    .create({
      username: 'username1',
      password: 'password1',
      provider: 'local',
    })
    .then(created => (user = created))
    .then(() => Station.create({
      title: 'station1',
      link: 'http://station1.com',
      description: 'test station1',
    }))
    .then(station => Podcast.create({
      title: 'station1 podcast1',
      link: 'http://station1.com/podcast1',
      description: 'station1 podcast1',
      station: station._id,
    }))
    .then(created => (podcast = created))
    .then(() => Playlist.create({
      title: 'Awesome playlist',
      owner: user._id,
      podcasts: [podcast._id],
    }))
    .then(created => (playlist = created))
    .then(() => {
      errorSpy = sinon.spy();
      handleError = sinon.stub().returns(errorSpy);
      controller = proxyquire('./playlist.auth', { '../../utils': { handleError } });
    }));

  describe('#populateReqPlaylist', () => {
    let res;
    let next;
    beforeEach(() => {
      res = mockRes();
      next = sinon.spy();
    });

    describe('with req.params.playlistId for valid playlist', () => {
      let req;
      beforeEach(() => {
        req = mockReq({ params: { playlistId: playlist.id } });
      });

      it('should decorate req with playlist and call next', () => controller
        .populateReqPlaylist(req, res, next)
        .then(() => {
          req.playlist.should.have.property('_id');
          req.playlist.should.have.property('title', 'Awesome playlist');
          req.playlist.should.have.property('podcasts');
          req.playlist.podcasts.should.contain(podcast._id);
          next.should.have.been.calledWith();
        }));
    });

    describe('with req.params.playlistId for non existent playlist', () => {
      it('should respond 404 not found', () => {
        const req = mockReq({ params: { playlistId: podcast.id } });
        return controller
          .populateReqPlaylist(req, res, next)
          .then(() => res.sendStatus.should.have.been.calledWith(404));
      });
    });

    describe('with non objectId req.params.playlistId', () => {
      it('should use errorHandler to send response', () => {
        const req = mockReq({ params: { playlistId: 'foo' } });
        return controller
          .populateReqPlaylist(req, res, next)
          .then(() => errorSpy.should.have.been.calledOnce);
      });
    });
  });

  describe('#isOwner', () => {
    let res;
    let next;
    beforeEach(() => {
      res = mockRes();
      next = sinon.spy();
    });

    describe('when req.playlist owner is req.user', () => {
      it('should call next', done => {
        const req = mockReq({ playlist: { owner: user._id }, user });
        controller.isOwner(req, res, next);
        next.should.have.been.calledWith();
        done();
      });
    });

    describe('when req.playlist owner is not req.user', () => {
      it('should send 403 Forbidden response', done => {
        const req = mockReq({ playlist: { owner: podcast._id }, user });
        controller.isOwner(req, res, next);
        res.sendStatus.should.have.been.calledWith(403);
        done();
      });
    });
  });
});
