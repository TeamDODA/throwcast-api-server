const { cleanModels } = require('../../utils/testing');
const Podcast = require('./podcast.model');
const Station = require('../station/station.model');
const db = require('../../db');

const title = 'fake podcast episode 1';
const link = 'https://fake.station.com/podcast1';
const description = 'Some description goes here.';
const imageUrl = 'https://some.where.com/optional-image.png';

const stations = [{
  title: 'station1',
  link: 'http://station1.com',
  description: 'fake station1',
}, {
  title: 'station2',
  link: 'http://station2.com',
  description: 'fake station2',
}];

const podcasts = [{
  title: 'station1 podcast1',
  link: 'http://station1.com/podcast1',
  description: 'station1 podcast1',
}, {
  title: 'station2 podcast1',
  link: 'http://station2.com/podcast1',
  description: 'station2 podcast1',
}];

describe('Podcast Model', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  let station1;
  let station2;
  beforeEach(() => Station.create(stations)
    .then(createdStations => ([station1, station2] = createdStations))
    .then(() => {
      podcasts[0].station = station1._id;
      podcasts[1].station = station2._id;
    }));
  afterEach(cleanModels);

  it('should start with no podcasts', () => Podcast.find().should.eventually.have.length(0));

  describe('#create', () => {
    describe('when given a valid record', () => {
      it('should successfully store the record', () => {
        const validPodcast = { title, link, description, imageUrl, station: station1._id };
        return Podcast.create(validPodcast).should.be.fulfilled;
      });

      it('should return the saved record with an objectId', () => {
        const validPodcast = { title, link, description, imageUrl, station: station1._id };
        return Podcast.create(validPodcast)
          .then(podcast => podcast.should.have.property('_id'));
      });
    });

    describe('when missing required fields', () => {
      it('should be rejected when creating with no title', () => {
        const missingTitle = { link, description, station: station2._id };
        return Podcast.create(missingTitle).should.be.rejected;
      });

      it('should be rejected when creating with no link', () => {
        const missingLink = { title, description, station: station2._id };
        return Podcast.create(missingLink).should.be.rejected;
      });

      it('should be rejected when creating with no description', () => {
        const missingDescription = { title, link, station: station2._id };
        return Podcast.create(missingDescription).should.be.rejected;
      });

      it('should be rejected when creating with no station', () => {
        const missingStation = { title, link, description };
        return Podcast.create(missingStation).should.be.rejected;
      });
    });

    describe('in bulk', () => {
      it('should be work for multiple records', () => (
        Podcast.create(podcasts).should.be.fulfilled)
      );

      it('should return the saved records in an with objectIds', () => (
        Podcast.create(podcasts)
          .then(createdPodcasts => {
            createdPodcasts[0].should.have.property('_id');
            createdPodcasts[1].should.have.property('_id');
          })
      ));
    });
  });

  describe('#populate', () => {
    describe('station', () => {
      it('should successfully populate', () => {
        const validPodcast = { title, link, description, imageUrl, station: station1._id };
        return Podcast.create(validPodcast)
          .then(createdPodcast => Podcast.findById(createdPodcast._id).populate('station'))
          .then(foundPodcast => {
            foundPodcast.station.id.should.equal(station1.id);
            foundPodcast.station.title.should.equal(station1.title);
            foundPodcast.station.link.should.equal(station1.link);
            foundPodcast.station.description.should.equal(station1.description);
          });
      });
    });
  });
});
