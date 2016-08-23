const tu = require('../../utils/testing');
const Podcast = require('./podcast.model');

const title = 'fake podcast episode 1';
const guid = 'podcast guid';
const description = 'Some description goes here.';
const image = 'https://some.where.com/optional-image.png';
const feed = 'https://some.rss.feed.uri';
const enclosure = {};

describe('Podcast Model', () => {
  let stations;
  beforeEach(() => tu.createStations(2)
    .then(created => (stations = created)));

  it('should start with no podcasts', () => Podcast.find().should.eventually.have.length(0));

  describe('#create', () => {
    describe('when given a valid record', () => {
      it('should successfully store the record', () => Podcast
        .create({ title, guid, description, image, enclosure, feed, station: stations[0]._id })
        .should.be.fulfilled);

      it('should return the saved record with an objectId', () => Podcast
        .create({ title, guid, description, image, enclosure, feed, station: stations[0]._id })
        .then(created => created.should.have.property('_id')));
    });

    describe('when missing required fields', () => {
      it('should be rejected when creating with no title', () => Podcast
        .create({ guid, station: stations[1]._id })
        .should.be.rejected);

      it('should be rejected when creating with no guid', () => Podcast
        .create({ title, station: stations[1]._id })
        .should.be.rejected);

      it('should be rejected when creating with no station', () => Podcast
        .create({ title, guid })
        .should.be.rejected);
    });

    describe('in bulk', () => {
      it('should be work for multiple records', () => Podcast
        .create([{
          title: 'stations1 podcast1',
          guid: 'stations1 podcast1',
          station: stations[0]._id,
        }, {
          title: 'stations2 podcast1',
          guid: 'stations2 podcast1',
          station: stations[1]._id,
        }])
        .should.eventually.be.fulfilled);

      it('should return the saved records with objectIds', () => Podcast
        .create([{
          title: 'stations1 podcast1',
          guid: 'stations1 podcast1',
          station: stations[0]._id,
        }, {
          title: 'stations2 podcast1',
          guid: 'stations2 podcast1',
          station: stations[1]._id,
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
        const validPodcast = { title, guid, station: stations[0]._id };
        return Podcast.create(validPodcast)
          .then(created => Podcast.findById(created._id).populate('station'))
          .then(found => {
            found.station.id.should.equal(stations[0].id);
            found.station.title.should.equal(stations[0].title);
            found.station.link.should.equal(stations[0].link);
            found.station.description.should.eql(stations[0].description);
          });
      });
    });
  });
});
