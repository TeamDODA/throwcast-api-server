const { cleanModels } = require('../../utils/testing');
const Playlist = require('./playlist.model');
const db = require('../../db');

const user = {
  name: 'test',
  owner: 'test',
};

describe('Playlist Model', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  afterEach(() => cleanModels());

  describe('Create playlists', () => {
    it('should start with no playlist', () => Playlist.find()
      .should.eventually.have.length(0));
    it('should reject playlist without required fields', () => Playlist.create(user.name)
      .should.be.rejected);
    it('should reject playlist with wrong information', () => Playlist.create(user)
      .should.be.rejected);
  });
});
