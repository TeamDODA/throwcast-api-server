const proxyquire = require('proxyquire');
const { mockReq, mockRes } = require('sinon-express-mock');

const tu = require('../../utils/testing');
const Playlist = require('../playlist/playlist.model');

describe('Playlist Auth', () => {
  let controller;
  let playlists;
  let podcasts;
  let users;
  let utilsStub;
  beforeEach(() => tu.createUsers(1)
    .then(created => (users = created))
    .then(() => tu.createStations(1))
    .then(tu.podcastsForStations)
    .then(created => (podcasts = created))
    .then(() => Playlist.create([{
      title: 'Awesome Playlist',
      owner: users[0]._id,
      podcasts: [podcasts[0]._id],
    }]))
    .then(created => (playlists = created))
    .then(() => {
      utilsStub = {
        handleError: sinon.stub().returns(sinon.spy()),
      };
      controller = proxyquire('./playlist.auth', { '../../utils': utilsStub });
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
        req = mockReq({ params: { playlistId: playlists[0].id } });
      });

      it('should decorate req with playlist and call next', () => controller
        .populateReqPlaylist(req, res, next)
        .then(() => {
          req.playlist.should.have.property('_id');
          req.playlist.should.have.property('title', 'Awesome Playlist');
          req.playlist.should.have.property('podcasts');
          req.playlist.podcasts.should.contain(podcasts[0]._id);
          next.should.have.been.calledWith();
        }));
    });

    describe('with req.params.playlistId for non existent playlist', () => {
      it('should respond 404 not found', () => {
        const req = mockReq({ params: { playlistId: podcasts[0].id } });
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
          .then(() => utilsStub.handleError().should.have.been.calledOnce);
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

    describe('requires user to be owner of playlist', () => {
      it('should send 403 Forbidden response', done => {
        const req = mockReq({ playlist: { owner: podcasts[0]._id }, user: users[0] });
        controller.isOwner(req, res, next);
        res.sendStatus.should.have.been.calledWith(403);
        done();
      });
    });

    describe('when req.playlist owner is req.user', () => {
      it('should call next', done => {
        const req = mockReq({ playlist: { owner: users[0]._id }, user: users[0] });
        controller.isOwner(req, res, next);
        next.should.have.been.calledWith();
        done();
      });
    });
  });
});
