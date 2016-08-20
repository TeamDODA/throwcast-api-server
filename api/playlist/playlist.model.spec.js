require('../../utils/testing');
const Playlist = require('./playlist.model');

const user = {
  title: 'test',
  owner: 'test',
};

describe('Playlist Model', () => {
  describe('Create playlists', () => {
    it('should start with no playlist', () => Playlist.find({})
      .should.eventually.have.length(0));
    it('should reject playlist without required fields', () => Playlist.create(user.name)
      .should.be.rejected);
    it('should reject playlist with wrong information', () => Playlist.create(user)
      .should.be.rejected);
  });
});
