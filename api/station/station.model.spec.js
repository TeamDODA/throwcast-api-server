require('../../utils/testing');
const Station = require('./station.model');

const title = 'fake station';
const link = 'https://fake.station.com';
const description = 'Some description goes here.';
const imageUrl = 'https://some.where.com/image.png';

describe('Station Model', () => {
  it('should start with no stations', () => Station.find({})
    .should.eventually.have.length(0));

  describe('#create', () => {
    describe('when given a valid record', () => {
      it('should successfully store the record', () => {
        const validStation = { title, link, description, imageUrl };
        return Station.create(validStation).should.be.fulfilled;
      });

      it('should return the saved record with an objectId', () => {
        const validStation = { title, link, description, imageUrl };
        return Station.create(validStation)
          .then(station => station.should.have.property('_id'));
      });
    });

    describe('when missing required fields', () => {
      it('should be rejected when creating with no title', () => {
        const missingTitle = { link, description };
        return Station.create(missingTitle).should.be.rejected;
      });

      it('should be rejected when creating with no link', () => {
        const missingLink = { title, description };
        return Station.create(missingLink).should.be.rejected;
      });

      it('should be rejected when creating with no description', () => {
        const missingDescription = { title, link };
        return Station.create(missingDescription).should.be.rejected;
      });
    });
  });
});
