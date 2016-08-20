const tu = require('../../utils/testing');
const Podcast = require('./podcast.model');

const title = 'fake podcast episode 1';
const link = 'https://fake.station.com/podcast1';
const description = 'Some description goes here.';
const imageUrl = 'https://some.where.com/optional-image.png';

describe('Podcast Model', () => {
  let stations;
  beforeEach(() => tu.createStations(2)
    .then(created => (stations = created)));

  it('should start with no podcasts', () => Podcast.find().should.eventually.have.length(0));

  describe('#create', () => {
    describe('when given a valid record', () => {
      it('should successfully store the record', () => Podcast
        .create({ title, link, description, imageUrl, station: stations[0]._id })
        .should.be.fulfilled);

      it('should return the saved record with an objectId', () => Podcast
        .create({ title, link, description, imageUrl, station: stations[0]._id })
        .then(created => created.should.have.property('_id')));
    });

    describe('when missing required fields', () => {
      it('should be rejected when creating with no title', () => Podcast
        .create({ link, description, station: stations[1]._id })
        .should.be.rejected);

      it('should be rejected when creating with no link', () => Podcast
        .create({ title, description, station: stations[1]._id })
        .should.be.rejected);

      it('should be rejected when creating with no description', () => Podcast
        .create({ title, link, station: stations[1]._id })
        .should.be.rejected);

      it('should be rejected when creating with no station', () => Podcast
        .create({ title, link, description })
        .should.be.rejected);
    });

    describe('in bulk', () => {
      it('should be work for multiple records', () => Podcast
        .create([{
          title: 'stations[0] podcast1',
          link: 'http://stations[0].com/podcast1',
          description: 'stations[0] podcast1',
          station: stations[0]._id,
        }, {
          title: 'stations[1] podcast1',
          link: 'http://stations[1].com/podcast1',
          description: 'stations[1] podcast1',
          station: stations[1]._id,
        }])
        .should.be.fulfilled);

      it('should return the saved records with objectIds', () => Podcast
        .create([{
          title: 'stations[0] podcast1',
          link: 'http://stations[0].com/podcast1',
          description: 'stations[0] podcast1',
          station: stations[0]._id,
        }, {
          title: 'stations[1] podcast1',
          link: 'http://stations[1].com/podcast1',
          description: 'stations[1] podcast1',
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
        const validPodcast = { title, link, description, imageUrl, station: stations[0]._id };
        return Podcast.create(validPodcast)
          .then(created => Podcast.findById(created._id).populate('station'))
          .then(found => {
            found.station.id.should.equal(stations[0].id);
            found.station.title.should.equal(stations[0].title);
            found.station.link.should.equal(stations[0].link);
            found.station.description.should.equal(stations[0].description);
          });
      });
    });
  });
});
