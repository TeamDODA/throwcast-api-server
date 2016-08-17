const { cleanModels } = require('../../utils/testing');
const User = require('./user.model');
const db = require('../../db');

const userRecord = {
  username: 'username1',
  password: 'password1',
};

describe('User Model', () => {
  before(() => db.connect().then(cleanModels));
  after(() => cleanModels().then(() => db.connection.close()));

  afterEach(() => cleanModels());

  it('should start with no users', () => User.find().should.eventually.have.length(0));

  describe('#create', () => {
    describe('when given a valid record', () => {
      const { username, password } = userRecord;
      const validUser = { username, password, provider: 'local' };

      it('should successfully store the user record', () => User.create(validUser)
        .should.be.fulfilled);

      describe('the created user', () => {
        let createdUser;
        beforeEach(() => User.create(validUser).then(user => (createdUser = user)));

        it('should have an objectId property', () => createdUser
          .should.have.property('_id'));

        it('should have a subscriptions property that is an empty array', () => createdUser
          .should.have.property('subscriptions')
          .and.have.length(0));

        it('should have a username property', () => createdUser
          .should.have.property('username')
          .and.equal(validUser.username));

        it('should have a hashed password property (not the supplied password)', () => createdUser
          .should.have.property('password')
          .and.not.equal(validUser.password));
      });
    });

    describe('when given a record with used username ', () => {
      const { username, password } = userRecord;
      const validUser = { username, password, provider: 'local' };
      beforeEach(() => User.create(validUser));

      it('should be rejected with a ValidationError', () => User.create(validUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('name', 'ValidationError'));

      it('should be rejected and have error code of 11000', () => User.create(validUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('message', 'User validation failed'));
    });

    describe('when given a record with no username', () => {
      const { password } = userRecord;
      const invalidUser = { password, provider: 'local' };

      it('should be rejected with a ValidationError', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('name', 'ValidationError'));

      it('should be rejected with message User validation failed', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('message', 'User validation failed'));
    });

    describe('when given a record with no password', () => {
      const { username } = userRecord;
      const invalidUser = { username, provider: 'local' };

      it('should be rejected with a ValidationError', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('name', 'ValidationError'));

      it('should be rejected with message User validation failed', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('message', 'User validation failed'));
    });

    describe('when given a record with a blank password', () => {
      const { username } = userRecord;
      const invalidUser = { username, password: '', provider: 'local' };

      it('should be rejected with a ValidationError', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('name', 'ValidationError'));

      it('should be rejected with message User validation failed', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('message', 'User validation failed'));
    });

    describe('when given a record with no provider', () => {
      const { username, password } = userRecord;
      const invalidUser = { username, password };

      it('should be rejected with a ValidationError', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('name', 'ValidationError'));

      it('should be rejected with message User validation failed', () => User.create(invalidUser)
        .should.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('message', 'User validation failed'));
    });
  });
});
