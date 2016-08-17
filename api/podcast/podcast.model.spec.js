const { cleanModels } = require('../../utils/testing');
const Podcast = require('./podcast.model');
const Station = require('../station/station.model');
const db = require('../../db');

const title = 'fake podcast episode 1';
const link = 'https://fake.station.com/podcast1';
const description = 'Some description goes here.';
const imageUrl = 'https://some.where.com/optional-image.png';

describe('Podcast Model', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let station1;
  let station2;
  beforeEach(() => Station
    .create([{
      title: 'station1',
      link: 'http://station1.com',
      description: 'fake station1',
    }, {
      title: 'station2',
      link: 'http://station2.com',
      description: 'fake station2',
    }])
    .then(created => ([station1, station2] = created)));
  afterEach(cleanModels);

  it('should start with no podcasts', () => Podcast.find().should.eventually.have.length(0));

  describe('#create', () => {
    describe('when given a valid record', () => {
      it('should successfully store the record', () => Podcast
        .create({ title, link, description, imageUrl, station: station1._id })
        .should.be.fulfilled);

      it('should return the saved record with an objectId', () => Podcast
        .create({ title, link, description, imageUrl, station: station1._id })
        .then(created => created.should.have.property('_id')));
    });

    describe('when missing required fields', () => {
      it('should be rejected when creating with no title', () => Podcast
        .create({ link, description, station: station2._id })
        .should.be.rejected);

      it('should be rejected when creating with no link', () => Podcast
        .create({ title, description, station: station2._id })
        .should.be.rejected);

      it('should be rejected when creating with no description', () => Podcast
        .create({ title, link, station: station2._id })
        .should.be.rejected);

      it('should be rejected when creating with no station', () => Podcast
        .create({ title, link, description })
        .should.be.rejected);
    });

    describe('in bulk', () => {
      it('should be work for multiple records', () => Podcast
        .create([{
          title: 'station1 podcast1',
          link: 'http://station1.com/podcast1',
          description: 'station1 podcast1',
          station: station1._id,
        }, {
          title: 'station2 podcast1',
          link: 'http://station2.com/podcast1',
          description: 'station2 podcast1',
          station: station2._id,
        }])
        .should.be.fulfilled);

      it('should return the saved records with objectIds', () => Podcast
        .create([{
          title: 'station1 podcast1',
          link: 'http://station1.com/podcast1',
          description: 'station1 podcast1',
          station: station1._id,
        }, {
          title: 'station2 podcast1',
          link: 'http://station2.com/podcast1',
          description: 'station2 podcast1',
          station: station2._id,
        }])
        .then(created => {
          created[0].should.have.property('_id');
          created[1].should.have.property('_id');
        }));
    });
  });

  describe('#populate', () => {
    describe('station', () => {
      it('should successfully populate', () => {
        const validPodcast = { title, link, description, imageUrl, station: station1._id };
        return Podcast.create(validPodcast)
          .then(created => Podcast.findById(created._id).populate('station'))
          .then(found => {
            found.station.id.should.equal(station1.id);
            found.station.title.should.equal(station1.title);
            found.station.link.should.equal(station1.link);
            found.station.description.should.equal(station1.description);
          });
      });
    });
  });
});
